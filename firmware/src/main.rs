#![no_main]
#![no_std]

use crate::{
    app::app_task,
    epd::Epd,
    midi::{make_midi_class, make_usb_builder, usb_task},
};

use defmt_rtt as _;
use embassy_executor::{Spawner, main};
use embassy_stm32::{
    Peripherals, bind_interrupts,
    peripherals::USB_OTG_FS,
    time::Hertz,
    usb::{self},
};
#[cfg(not(debug_assertions))]
use panic_abort as _;
#[cfg(debug_assertions)]
use panic_probe as _;

macro_rules! static_ref {
    ($ty:ty = $expr:expr) => {{
        static CELL: static_cell::StaticCell<$ty> = StaticCell::new();
        CELL.init($expr)
    }};
}

mod app;
mod epd;
mod midi;
mod pack;
mod sysex;
mod uid;

bind_interrupts!(pub struct Irqs {
  OTG_FS => usb::InterruptHandler<USB_OTG_FS>;
});

fn init_peripherals() -> Peripherals {
    embassy_stm32::init({
        use embassy_stm32::rcc::*;
        let mut config = embassy_stm32::Config::default();

        config.rcc.hse = Some(Hse {
            freq: Hertz(12_000_000),
            mode: HseMode::Oscillator,
        });
        config.rcc.pll_src = PllSource::HSE;
        config.rcc.pll = Some(Pll {
            prediv: PllPreDiv::DIV12,  // 12 / 12 = 1 MHz
            mul: PllMul::MUL192,       // 1 * 192 = 192 MHz
            divp: Some(PllPDiv::DIV2), // 192 / 2 = 96 MHz <= 100 MHz max freq
            divq: Some(PllQDiv::DIV4), // 192 / 4 = 48 MHz necessary for USB
            divr: None,
        });
        config.rcc.ahb_pre = AHBPrescaler::DIV1;
        config.rcc.apb1_pre = APBPrescaler::DIV2;
        config.rcc.apb2_pre = APBPrescaler::DIV4;
        config.rcc.sys = Sysclk::PLL1_P;
        config.rcc.mux.clk48sel = mux::Clk48sel::PLL1_Q;

        config
    })
}

#[main]
async fn main(spawner: Spawner) {
    let peri = init_peripherals();
    let epd = Epd::new(
        peri.SPI1, peri.PA4, peri.PA5, peri.PA7, peri.PB10, peri.PB0, peri.PB1,
    );

    let mut usb_builder = make_usb_builder(peri.USB_OTG_FS, peri.PA12, peri.PA11).await;
    let midi = make_midi_class(&mut usb_builder);

    spawner.must_spawn(usb_task(usb_builder));
    spawner.must_spawn(app_task(epd, midi));
}
