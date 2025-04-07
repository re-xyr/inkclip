use embassy_stm32::gpio::{self, Level, Pull, Speed};
use embassy_stm32::spi::{self, MosiPin, SckPin, Spi};
use embassy_stm32::time::Hertz;
use embassy_time::Delay;
use embedded_hal_bus::spi::ExclusiveDevice;

use epd_waveshare::epd1in54::Display1in54;
use epd_waveshare::epd1in54_v2::Epd1in54;
use epd_waveshare::prelude::*;

type EpdSpiDevice =
    ExclusiveDevice<Spi<'static, embassy_stm32::mode::Blocking>, gpio::Output<'static>, Delay>;

pub struct Epd {
    spi_device: EpdSpiDevice,
    epd: Epd1in54<
        EpdSpiDevice,
        gpio::Input<'static>,
        gpio::Output<'static>,
        gpio::Output<'static>,
        Delay,
    >,
}

impl Epd {
    pub fn new<SPI: spi::Instance>(
        spi: SPI,
        cs: impl gpio::Pin,
        sck: impl SckPin<SPI>,
        mosi: impl MosiPin<SPI>,
        busy: impl gpio::Pin,
        dc: impl gpio::Pin,
        rst: impl gpio::Pin,
    ) -> Epd {
        let cs_pin = gpio::Output::new(cs, Level::High, Speed::VeryHigh);
        let busy_pin = gpio::Input::new(busy, Pull::Down);
        let dc_pin = gpio::Output::new(dc, Level::High, Speed::VeryHigh);
        let rst_pin = gpio::Output::new(rst, Level::High, Speed::VeryHigh);

        let mut spi_config = spi::Config::default();
        spi_config.frequency = Hertz(20_000_000);
        let spi_bus = Spi::new_blocking_txonly(spi, sck, mosi, spi_config);
        let mut spi_device = ExclusiveDevice::new(spi_bus, cs_pin, Delay {}).unwrap();

        let epd = Epd1in54::new(
            &mut spi_device,
            busy_pin,
            dc_pin,
            rst_pin,
            &mut Delay {},
            Some(0),
        )
        .unwrap();

        return Epd { spi_device, epd };
    }

    pub fn update_display(&mut self, display: &Display1in54) {
        self.epd
            .update_and_display_frame(&mut self.spi_device, display.buffer(), &mut Delay {})
            .unwrap_or(())
    }
}
