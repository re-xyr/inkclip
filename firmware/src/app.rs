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
        chroma: Chroma,
        pattern: &'a [u8],
    },
    Ping,
}

#[derive(Serialize)]
enum Response<'a> {
    GetIdentification { model: DeviceType, serial: &'a str },
    UpdateDisplay,
    SetPattern,
    Ping,
}

const PATTERN_SIZE: usize = 5000;
const MAGIC_NUMBER_LEN: usize = 1;
const MAGIC_NUMBER: [u8; MAGIC_NUMBER_LEN] = [0x7d]; // Generic educational/R&D

#[task]
pub async fn app_task(epd: Epd, midi: UsbMidi) {
    App {
        epd,
        midi,
        display: Display1in54::default(),
    }
    .run()
    .await
}

struct App {
    epd: Epd,
    midi: UsbMidi,
    display: Display1in54,
}

impl App {
    async fn handle_request<'a>(&mut self, req: Request<'a>) {
        match req {
            Request::SetPattern {
                from,
                chroma,
                pattern,
            } => self.handle_set_pattern(from, chroma, pattern).await,
            Request::UpdateDisplay => self.handle_update_display().await,
            Request::GetIdentification => self.handle_get_identification().await,
            Request::Ping => self.write_response(Response::Ping).await,
        }
    }

    async fn handle_set_pattern(&mut self, from: u32, _chroma: Chroma, pattern: &[u8]) {
        let from = from as usize;
        let buffer_len = (self.display.size().width * self.display.size().height) as usize;

        if from >= PATTERN_SIZE || from + pattern.len() > buffer_len {
            warn!(
                "SetPattern: specified [{}, {}) is out of range (len = {})",
                from,
                from + pattern.len(),
                pattern.len(),
            );
            return;
        }

        let width = self.display.size().width as i32;
        for (stride, &byte) in pattern.iter().enumerate() {
            for stroll in 0..8 {
                let bit_ix = (from + stride) as i32 * 8 + stroll;
                let x = bit_ix % width;
                let y = bit_ix / width;
                self.display
                    .set_pixel(Pixel(Point { x, y }, color_at(byte, stroll)));
            }
        }

        self.write_response(Response::SetPattern).await;
    }

    async fn handle_update_display(&mut self) {
        self.epd.update_display(&self.display);
        self.write_response(Response::UpdateDisplay).await;
    }

    async fn handle_get_identification(&mut self) {
        self.write_response(Response::GetIdentification {
            serial: uid_base64(),
            model: DeviceType::BWRev1,
        })
        .await;
    }

    async fn write_response<'a>(&mut self, resp: Response<'a>) {
        const SYSEX_MAX: usize = 1024 - 2; // 2-byte framing
        const POSTCARD_WIRE_MAX: usize = (SYSEX_MAX - MAGIC_NUMBER_LEN) * 7 / 8; // 7-in-8 encoding overhead
        const USB_WIRE_MAX: usize = (SYSEX_MAX * 4).div_ceil(3); // USB MIDI muxing overhead

        let mut resp_buffer = [0u8; POSTCARD_WIRE_MAX];
        let payload_slice = match postcard::to_slice(&resp, &mut resp_buffer) {
            Ok(slice) => slice,
            Err(err) => {
                error!("write_response: postcard encoding returns {}", err);
                return;
            }
        };

        let mut encode_buffer = [0u8; SYSEX_MAX];
        encode_buffer[..MAGIC_NUMBER_LEN].copy_from_slice(&MAGIC_NUMBER);
        let Some(encoded_len) = encode_7in8(payload_slice, &mut encode_buffer[MAGIC_NUMBER_LEN..])
        else {
            error!("write_response: 7-in-8 encoding overflows the buffer");
            return;
        };

        let mut sysex_encoder = SysExEncoder::<USB_WIRE_MAX>::new();
        let Some(encoded) = sysex_encoder.encode(&encode_buffer[..MAGIC_NUMBER_LEN + encoded_len])
        else {
            error!("write_response: USB MIDI encoding overflows the buffer");
            return;
        };

        for chunk in encoded.chunks(64) {
            match self.midi.write_packet(chunk).await {
                Ok(_) => {}
                Err(EndpointError::BufferOverflow) => {
                    error!("write_response: EP buffer overflowed");
                    return;
                }
                Err(EndpointError::Disabled) => {
                    warn!(
                        "write_response: EP disabled when writing a response. Remainder will be discarded"
                    );
                    return;
                }
            };
        }
    }

    pub async fn run(&mut self) {
        let mut sysex_parser = SysExParser::<1024>::new();

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

                            match postcard::from_bytes::<Request>(decode_7in8(
                                &mut sysex[MAGIC_NUMBER_LEN..],
                            )) {
                                Ok(parsed) => self.handle_request(parsed).await,
                                Err(err) => {
                                    warn!("App: cannot parse payload ({}). dropping.", err);
                                    continue;
                                }
                            };
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
