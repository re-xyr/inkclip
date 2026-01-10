use embassy_executor::task;
use embassy_stm32::{
    Peri,
    peripherals::USB_OTG_FS,
    usb::{self, DmPin, DpPin},
};
use embassy_usb::{UsbVersion, class::midi::MidiClass};
use static_cell::StaticCell;

use crate::{Irqs, uid};

pub type UsbDriver = usb::Driver<'static, USB_OTG_FS>;
pub type UsbBuilder = embassy_usb::Builder<'static, UsbDriver>;
pub type UsbMidi = MidiClass<'static, UsbDriver>;

pub async fn make_usb_builder(
    peri: Peri<'static, USB_OTG_FS>,
    dp: Peri<'static, impl DpPin<USB_OTG_FS>>,
    dm: Peri<'static, impl DmPin<USB_OTG_FS>>,
) -> UsbBuilder {
    let ep_out_buffer = static_ref!([u8; 256] = [0; 256]);
    let config_descriptor = static_ref!([u8; 256] = [0; 256]);
    let control_buf = static_ref!([u8; 256] = [0; 256]);

    let mut config = embassy_usb::Config::new(0x1209, 0xc9c9);
    config.manufacturer = Some("Project Daylily");
    config.product = Some("Inkclip BW");
    config.serial_number = Some(uid::uid_base64().await);
    config.bcd_usb = UsbVersion::Two;

    let usb_driver = usb::Driver::new_fs(peri, Irqs, dp, dm, ep_out_buffer, usb::Config::default());
    embassy_usb::Builder::new(
        usb_driver,
        config,
        config_descriptor,
        &mut [],
        &mut [],
        control_buf,
    )
}

pub fn make_midi_class(builder: &mut UsbBuilder) -> UsbMidi {
    UsbMidi::new(builder, 1, 1, 64)
}

#[task]
pub async fn usb_task(builder: UsbBuilder) -> ! {
    let mut device = builder.build();
    device.run().await;
}
