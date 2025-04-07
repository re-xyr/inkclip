use defmt::*;

use embedded_graphics::prelude::*;
use epd_waveshare::epd1in54_v2::Display1in54;
use epd_waveshare::prelude::*;

use crate::device::epd::Epd;
use crate::device::usb_hid::Hid;
use crate::util::{uid_base64, uid_base64_bytes};

pub mod descriptor;

pub const USB_READ_BUFFER_SIZE: usize = 8192;
pub const USB_WRITE_BUFFER_SIZE: usize = 32;

const WRITE_PATTERN_REPORT_ID: u8 = 0x01;
const SERIAL_NUMBER_REPORT_ID: u8 = 0x02;

fn color_at(byte: u8, ix: i32) -> Color {
    defmt::debug_assert!(0 <= ix && ix < 8);

    if byte & (1u8 << ix) == 0 {
        Color::White
    } else {
        Color::Black
    }
}

pub struct MainLoop<'a> {
    pub hid: Hid<'a, USB_READ_BUFFER_SIZE, USB_WRITE_BUFFER_SIZE>,
    pub epd: Epd,
}

impl<'a> MainLoop<'a> {
    fn draw_pattern(&mut self, buf: &[u8]) {
        debug!("Updating display");

        let mut buf_size = buf.len();

        if buf_size < 5000 {
            warn!("WRITE_PATTERN buffer too short (buf_size = {})", buf_size);
        } else if buf_size > 5000 {
            warn!(
                "WRITE_PATTERN buffer too long; truncating (buf_size = {})",
                buf_size
            );
            buf_size = 5000;
        }

        let mut display = Display1in54::default();
        display.set_rotation(DisplayRotation::Rotate180);
        let width = display.size().width as i32;

        for (stride, &byte) in buf[..buf_size].iter().enumerate() {
            for stroll in 0..8 {
                let ix = stride as i32 * 8 + stroll;
                let x = ix % width;
                let y = ix / width;
                display.set_pixel(Pixel(Point { x, y }, color_at(byte, stroll)));
            }
        }

        self.epd.update_display(&display);
    }

    async fn send_serial_number(&mut self) {
        debug!("Sending serial number {}", uid_base64());

        self.hid
            .write(SERIAL_NUMBER_REPORT_ID, uid_base64_bytes())
            .await;
    }

    pub async fn run(&mut self) -> ! {
        let mut read_buf = [0u8; USB_READ_BUFFER_SIZE];

        loop {
            let (id, buf) = self.hid.read(&mut read_buf).await;
            match id {
                WRITE_PATTERN_REPORT_ID => self.draw_pattern(buf),
                SERIAL_NUMBER_REPORT_ID => self.send_serial_number().await,
                _ => warn!("Unknown report ID: {}", buf[0]),
            }
        }
    }
}
