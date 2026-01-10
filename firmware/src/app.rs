use core::cmp::Ordering;

use crate::{
    epd::Epd,
    midi::UsbMidi,
    pack::{decode_7in8, encode_7in8},
    sysex::{SysExEncoder, SysExParser},
    uid::uid_base64,
};
use defmt::{error, info, warn};
use embassy_executor::task;
use embassy_usb::driver::EndpointError;
use embedded_graphics::prelude::*;
use epd_waveshare::{epd1in54::Display1in54, prelude::*};
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
enum DeviceType {
    BWRev1, // Black-and-white, API Rev. 1
}

#[derive(Deserialize)]
enum Chroma {
    Black,
}

// GetIdentification is always `0x00`, and the device should always return a response starting with
// the two-byte sequence `0x00 [DeviceType]`. Theoretically this leaves space for different devices
// to adopt different schemas (although we hope to only use this as a last resort).

#[derive(Deserialize)]
enum Request<'a> {
    GetIdentification,
    UpdateDisplay,
    SetPattern {
        from: u32,
        to: u32,
        chroma: Chroma,
        pattern: &'a [u8],
    },
}

#[derive(Serialize)]
enum Response<'a> {
    GetIdentification { model: DeviceType, serial: &'a str },
    UpdateDisplay,
    SetPattern,
}

const PATTERN_SIZE: usize = 5000;
const MAGIC_NUMBER_LEN: usize = 1;
const MAGIC_NUMBER: [u8; MAGIC_NUMBER_LEN] = [0x7d]; // Generic educational/R&D

#[task]
pub async fn app_task(epd: Epd, midi: UsbMidi) {
    App {
        epd,
        midi,
        pattern: [0; PATTERN_SIZE],
    }
    .run()
    .await
}

struct App {
    epd: Epd,
    midi: UsbMidi,
    pattern: [u8; PATTERN_SIZE],
}

impl App {
    async fn handle_request<'a>(&mut self, req: Request<'a>) {
        match req {
            Request::SetPattern {
                from,
                to,
                chroma,
                pattern,
            } => self.handle_set_pattern(from, to, chroma, pattern).await,
            Request::UpdateDisplay => self.handle_update_display().await,
            Request::GetIdentification => self.handle_get_identification().await,
        }
    }

    async fn handle_set_pattern(&mut self, from: u32, to: u32, _chroma: Chroma, pattern: &[u8]) {
        let from = from as usize;
        let to = to as usize;
        if from >= PATTERN_SIZE || to > PATTERN_SIZE || from > to {
            warn!(
                "SetPattern: 'from' and/or 'to' out of range (from = {}, to = {}, PATTERN_SIZE = {})",
                from, to, PATTERN_SIZE
            );
            return;
        }

        let buf_size = match pattern.len().cmp(&(to - from)) {
            Ordering::Less => {
                warn!(
                    "SetPattern buffer too short (buf_size = {}, range_size = {})",
                    pattern.len(),
                    to - from,
                );
                pattern.len()
            }
            Ordering::Equal => pattern.len(),
            Ordering::Greater => {
                warn!(
                    "SetPattern buffer too long; truncating (buf_size = {}, range_size = {})",
                    pattern.len(),
                    to - from,
                );
                to - from
            }
        };

        for (stride, &byte) in pattern[..buf_size].iter().enumerate() {
            self.pattern[from + stride] = byte;
        }

        self.write_response(Response::SetPattern).await;
    }

    async fn handle_update_display(&mut self) {
        let mut display = Display1in54::default();
        display.set_rotation(DisplayRotation::Rotate180);
        let width = display.size().width as i32;

        for (stride, &byte) in self.pattern.iter().enumerate() {
            for stroll in 0..8 {
                let ix = stride as i32 * 8 + stroll;
                let x = ix % width;
                let y = ix / width;
                display.set_pixel(Pixel(Point { x, y }, color_at(byte, stroll)));
            }
        }

        self.epd.update_display(&display);
        self.write_response(Response::UpdateDisplay).await;
    }

    async fn handle_get_identification(&mut self) {
        self.write_response(Response::GetIdentification {
            serial: uid_base64().await,
            model: DeviceType::BWRev1,
        })
        .await;
    }

    async fn write_response<'a>(&mut self, resp: Response<'a>) -> bool {
        const RESP_N: usize = 1024;

        let mut resp_buffer = [0u8; RESP_N];
        let Ok(payload_slice) = postcard::to_slice(&resp, &mut resp_buffer) else {
            error!("write_response: postcard encoding overflows the buffer");
            return false;
        };

        let mut encode_buffer = [0u8; RESP_N];
        encode_buffer[..MAGIC_NUMBER_LEN].copy_from_slice(&MAGIC_NUMBER);
        let Some(encoded_len) = encode_7in8(payload_slice, &mut encode_buffer[MAGIC_NUMBER_LEN..])
        else {
            error!("write_response: 7-in-8 encoding overflows the buffer");
            return false;
        };

        let mut sysex_encoder = SysExEncoder::<1024>::new();
        let Some(encoded) = sysex_encoder.encode(&encode_buffer[..MAGIC_NUMBER_LEN + encoded_len])
        else {
            error!("write_response: USB MIDI encoding overflows the buffer");
            return false;
        };

        for chunk in encoded.chunks(64) {
            let Ok(_) = self.midi.write_packet(chunk).await else {
                error!("write_response: failed to write response");
                return false;
            };
        }
        true
    }

    pub async fn run(&mut self) {
        let mut sysex_parser = SysExParser::<8192>::new();

        '_connection: loop {
            self.midi.wait_connection().await;

            'packet: loop {
                let mut packet_in_buf = [0u8; 64];

                match self.midi.read_packet(&mut packet_in_buf).await {
                    Err(EndpointError::BufferOverflow) => {
                        error!(
                            "App: read more than 64 bytes at once from EP. This should not be happening!"
                        )
                    }
                    Err(EndpointError::Disabled) => {
                        info!("App: EP has been disabled; waiting to be enabled again.");
                        break 'packet;
                    }
                    Ok(nread) => {
                        for midi_packet in packet_in_buf[..nread].chunks_exact(4) {
                            let Some(midi_msg) = sysex_parser.feed(midi_packet) else {
                                continue;
                            };

                            let midi_msg_len = midi_msg.len();
                            if midi_msg_len < 2
                                || midi_msg[0] != 0xf0
                                || midi_msg[midi_msg_len - 1] != 0xf7
                            {
                                warn!("App: MIDI event not SysEx; dropping.");
                                continue;
                            }

                            let sysex = &mut midi_msg[1..midi_msg_len - 1];
                            if sysex.len() < MAGIC_NUMBER_LEN
                                || sysex[..MAGIC_NUMBER_LEN] != MAGIC_NUMBER
                            {
                                warn!(
                                    "App: SysEx does not start with magic number; first {} bytes = {}. dropping.",
                                    MAGIC_NUMBER_LEN.min(sysex.len()),
                                    sysex[..MAGIC_NUMBER_LEN.min(sysex.len())]
                                );
                                continue;
                            }

                            let Ok(parsed) = postcard::from_bytes::<Request>(decode_7in8(
                                &mut sysex[MAGIC_NUMBER_LEN..],
                            )) else {
                                warn!("App: cannot parse payload. dropping.");
                                continue;
                            };
                            self.handle_request(parsed).await;
                        }
                    }
                }
            }
        }
    }
}

fn color_at(byte: u8, ix: i32) -> Color {
    debug_assert!(0 <= ix && ix < 8);

    if byte & (1u8 << ix) == 0 {
        Color::White
    } else {
        Color::Black
    }
}
