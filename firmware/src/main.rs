#![no_main]
#![no_std]
#![feature(impl_trait_in_assoc_type)]

use defmt::*;
use embassy_executor::Spawner;
use embassy_futures::join::join;

use device::epd::Epd;
use device::usb_hid::Hid;
use device::usb_hid::get_usb_builder;
use embassy_stm32::usb;
use embassy_usb::UsbVersion;
use embassy_usb::class::hid;
use usbd_hid::descriptor::generator_prelude::*;

use init::init_peripherals;
use util::uid_base64;

use app::MainLoop;
use app::descriptor::HIDReports;

use {defmt_rtt as _, panic_probe as _};

mod app;
mod device;
mod init;
mod util;

#[embassy_executor::main]
async fn main(_spawner: Spawner) {
    let peri = init_peripherals();

    info!("Initialized peripherals");

    let epd = Epd::new(
        peri.SPI1, peri.PA4, peri.PA5, peri.PA7, peri.PB10, peri.PB0, peri.PB1,
    );

    info!("Established SPI link to e-paper display");

    let mut ep_out_buffer = [0u8; 256];
    let mut config_descriptor = [0; 256];
    let mut control_buf = [0; 256];
    let mut state = hid::State::new();

    let mut builder_config = embassy_usb::Config::new(0x1209, 0xc9c9);
    builder_config.manufacturer = Some("daylily");
    builder_config.product = Some("“Inkclip” 1.54″ ePaper Accessory");
    builder_config.serial_number = Some(uid_base64());

    // Caution: past USB 2.0 (including USB 2.1 aka 2.0 LPM), BOS descriptors become necessary
    builder_config.bcd_usb = UsbVersion::Two;

    let mut builder = get_usb_builder(
        peri.USB_OTG_FS,
        peri.PA12,
        peri.PA11,
        &mut ep_out_buffer,
        usb::Config::default(),
        builder_config,
        &mut config_descriptor,
        &mut [], // USB 2.0 does not require BOS descriptors
        &mut [], // Non vendor-specific devices/interfaces do not require MS OS descriptors
        &mut control_buf,
    );

    let usb_hid = Hid::new(&mut builder, HIDReports::desc(), &mut state);

    let mut main_loop = MainLoop { epd, hid: usb_hid };
    let main_fut = main_loop.run();

    let mut usb_device = builder.build();
    let usb_fut = usb_device.run();

    info!("Initialized USB HID device");

    join(main_fut, usb_fut).await;
}
