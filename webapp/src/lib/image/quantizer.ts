import RgbQuant, { type DitheringKernel, type RgbQuantImage } from '$lib/vendor/rgbquant'

export type { DitheringKernel, RgbQuantImage } from '$lib/vendor/rgbquant'

export const DEFAULT_DITHERING_KERNEL: DitheringKernel = 'Atkinson'

export type QuantizerOptions = {
  ditheringKernel: DitheringKernel | null
  contrast: number
  brightness: number
}

export class Quantizer {
  public readonly black: number
  public readonly white: number

  private readonly rgbquant: RgbQuant

  constructor({ ditheringKernel, contrast, brightness }: QuantizerOptions) {
    const saturationAdjustment = ditheringKernel === null ? 127 : 127 * contrast
    this.white = 255 - (1 + brightness) * saturationAdjustment
    this.black = (1 - brightness) * saturationAdjustment

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
