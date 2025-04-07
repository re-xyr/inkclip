use defmt::*;

use embassy_stm32::peripherals::USB_OTG_FS;
use embassy_stm32::usb::{self, DmPin, DpPin};
use embassy_usb::class::hid::{self, HidReader, HidReaderWriter, HidWriter};
use embassy_usb::driver::EndpointError;

use crate::init::Irqs;

pub type UsbBuilder<'d> = embassy_usb::Builder<'d, usb::Driver<'d, USB_OTG_FS>>;

pub fn get_usb_builder<'d>(
    usb_peri: USB_OTG_FS,
    dp: impl DpPin<USB_OTG_FS>,
    dm: impl DmPin<USB_OTG_FS>,
    ep_out_buffer: &'d mut [u8],
    driver_config: usb::Config,
    builder_config: embassy_usb::Config<'d>,
    config_descriptor: &'d mut [u8],
    bos_descriptor: &'d mut [u8],
    msos_descriptor: &'d mut [u8],
    control_buf: &'d mut [u8],
) -> UsbBuilder<'d> {
    let driver = usb::Driver::new_fs(usb_peri, Irqs, dp, dm, ep_out_buffer, driver_config);

    return embassy_usb::Builder::new(
        driver,
        builder_config,
        config_descriptor,
        bos_descriptor,
        msos_descriptor,
        control_buf,
    );
}

pub struct Hid<'d, const READ_N: usize, const WRITE_N: usize> {
    reader: HidReader<'d, usb::Driver<'d, USB_OTG_FS>, READ_N>,
    writer: HidWriter<'d, usb::Driver<'d, USB_OTG_FS>, WRITE_N>,
}

impl<'d, const READ_N: usize, const WRITE_N: usize> Hid<'d, READ_N, WRITE_N> {
    pub fn new(
        usb_builder: &mut UsbBuilder<'d>,
        report_descriptor: &'d [u8],
        state: &'d mut hid::State<'d>,
    ) -> Hid<'d, READ_N, WRITE_N> {
        let hid_config = hid::Config {
            report_descriptor,
            request_handler: None,
            poll_ms: 10,
            max_packet_size: 64,
        };

        let (reader, writer) = HidReaderWriter::new(usb_builder, state, hid_config).split();
        return Hid { reader, writer };
    }

    async fn internal_read<'a, const USE_ID: bool>(
        &mut self,
        buf: &'a mut [u8; READ_N],
    ) -> (u8, &'a [u8]) {
        loop {
            match self.reader.read(buf).await {
                Ok(len) => {
                    if USE_ID {
                        if len < 1 {
                            warn!("Received no report ID")
                        } else {
                            return (buf[0], &buf[1..len]);
                        }
                    } else {
                        return (0, &buf[..len]);
                    }
                }
                Err(hid::ReadError::BufferOverflow) => {
                    warn!("Buffer overflow when reading from host")
                }
                Err(hid::ReadError::Disabled) => {
                    info!("Endpoint disabled");
                    self.reader.ready().await
                }
                Err(hid::ReadError::Sync(_)) => defmt::unreachable!(),
            }
        }
    }

    pub async fn read<'a>(&mut self, buf: &'a mut [u8; READ_N]) -> (u8, &'a [u8]) {
        self.internal_read::<true>(buf).await
    }

    #[allow(dead_code)]
    pub async fn read_no_id<'a>(&mut self, buf: &'a mut [u8; READ_N]) -> &'a [u8] {
        self.internal_read::<false>(buf).await.1
    }

    pub async fn write(&mut self, id: u8, report: &[u8]) {
        let payload_size = report.len() + 1;

        if payload_size > WRITE_N {
            error!(
                "Buffer overflow when writing to host (report_size = {})",
                payload_size
            );
            return;
        }

        let mut payload = [id; WRITE_N];
        payload[1..payload_size].copy_from_slice(report);

        self.writer
            .write(&payload[..payload_size])
            .await
            .unwrap_or_else(|err| match err {
                EndpointError::BufferOverflow => error!("Buffer overflow when writing to host"),
                EndpointError::Disabled => warn!("Endpoint disabled"),
            });

        info!("Written report #{}: {}", id, report);
    }
}
