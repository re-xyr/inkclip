use embassy_stm32::bind_interrupts;
use embassy_stm32::peripherals::USB_OTG_FS;
use embassy_stm32::time::Hertz;
use embassy_stm32::usb;
use embassy_stm32::{Config, Peripherals};

bind_interrupts!(pub struct Irqs {
  OTG_FS => usb::InterruptHandler<USB_OTG_FS>;
});

pub fn init_peripherals() -> Peripherals {
    let mut config = Config::default();
    {
        use embassy_stm32::rcc::*;
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
    }

    return embassy_stm32::init(config);
}
