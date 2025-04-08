# Inkclip Firmware

This is the firmware implementation for Inkclip. It implements a USB 2.0 HID device with the following reports:

- **Write Pattern:** Report ID = 0x01, Direction = Output (host to device), Size = 5,000 bytes.

  Updates the pattern on the e-paper display of the device. The 5,000 bytes are interpreted as a 40,000-bit bit vector that represents a bitmap of the 200x200 pattern to be displayed. Each byte is the little-endian representation of 8 pixels on the display, from left to right, from top to bottom, in row-major order.

  Namely, the `k`th least significant bit in the `n`th byte of the report represents the pixel value at coordinates `(x, y) = (n % 25 + k, n / 25)`.

- **Serial Number Request:** Report ID = 0x02, Direction = Output (host to device), Size = 1 byte.

  Sends a request for the device's unique serial number. The content of the 1-byte payload is ignored.

- **Serial Number Response:** Report ID = 0x02, Direction = Input (device to host), Size = 16 bytes.

  An ASCII representation of the device's unique serial number. Currently, this is implemented as the base-64 encoding of the 12-byte UID of the STM32 MCU.

## Flashing the Firmware

If you simply want to flash the firmware onto a completed Inkclip device, you can use the [cargo-dfu](https://github.com/dfu-rs/cargo-dfu) tool. Simply connect the device via USB with BOOT0 pulled up and then run under this directory

```sh
cargo dfu --release
```

If you want to debug this firmware through e.g. [SWD](https://developer.arm.com/documentation/100893/latest/Debug-and-trace-interface/Serial-Wire-Debug-signals) then you can use [probe-rs](https://probe.rs/) with a debugging probe instead.

## Implementation Details

- The USB device sets the maximum current to 100mA, which should be well above the active power draw of the actual hardware (9mA MCU + 8mA e-paper).
- The SPI link between the MCU and the e-paper display is 20MHz, which is the maximum supported frequency listed on the display module's datasheet.
- This firmware is implemented in no_std Rust with the [embassy](https://embassy.dev) framework and the [embassy-stm32](https://docs.embassy.dev/embassy-stm32/git/stm32f411ce/index.html) HAL.
