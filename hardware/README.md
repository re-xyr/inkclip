# PCB design files of Inkclip

This is the [KiCad](https://www.kicad.org/) project for the PCB design of Inkclip. This PCB is designed to work with [Waveshare's 1.54-inch e-paper](https://www.waveshare.com/product/1.54inch-e-paper.htm).

The shape of the PCB is a 32.80 x 38.32mm rectangle with 1mm-radius dogbone corners. This ensures 0.5mm clearance from the PCB edge to the e-paper everywhere along the edges. Approximately in the middle of the PCB there is a 7.5mm wide horizontal component-free zone where you may attach mounting solutions of your choice (e.g. a hairclip, a pin, a pocket clip, velcro, tape, etc).

Specifically notice that the 24-pin FPC connector must be *top-contact* since the FPC cable of the display module is supposed to bend over so that the display may be mounted on the back side of the PCB. The positioning of this FPC connector is under the assumption that the PCB is 1.0mm thick, which is the thinnest [JLCPCB](https://jlcpcb.com) could print without the price going up. If you plan to print a thinner/thicker PCB then you might need to adjust the position of this connector accordingly.

This design uses an [STM32F411CEU6](https://www.st.com/en/microcontrollers-microprocessors/stm32f411ce.html) MCU. It has 512kB flash and 128kB RAM, which should be significantly more than what is needed by the firmware provided in this repository. On the bottom-right corner of the PCB there are pin holes for SWD debugging in the order [GND, SWCLK, SWDIO, 3V3]. The pushbutton on the PCB pulls BOOT0 up, which brings the MCU into DFU mode where you can write firmware over USB.
