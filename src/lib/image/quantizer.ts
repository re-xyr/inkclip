import RgbQuant from '$lib/vendor/rgbquant'
import type { DitheringKernel, RgbQuantImage } from '$lib/vendor/rgbquant'

export type { DitheringKernel, RgbQuantImage } from '$lib/vendor/rgbquant'

export const DEFAULT_DITHERING_KERNEL: DitheringKernel = 'Atkinson'

export type QuantizerOptions = {
  ditheringKernel: DitheringKernel | null
  contrast: number
  bias: number
}

export class Quantizer {
  public readonly black: number
  public readonly white: number

  private readonly rgbquant: RgbQuant

  constructor({ ditheringKernel, contrast, bias }: QuantizerOptions) {
    const saturationAdjustment = ditheringKernel === null ? 127 : 127 * contrast
    this.white = 255 + (bias - 1) * saturationAdjustment
    this.black = (1 + bias) * saturationAdjustment

    this.rgbquant = new RgbQuant({
      colors: 2,
      dithKern: ditheringKernel,
      palette: [
        [this.white, this.white, this.white],
        [this.black, this.black, this.black],
      ],
      useCache: false,
    })
  }

  reduce(image: RgbQuantImage): number[] {
    return this.rgbquant.reduce(image, 2)
  }
}
