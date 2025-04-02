import { DEFAULT_DITHERING_KERNEL, type DitheringKernel } from '$lib/image/quantizer'
import type { ScaleMode } from '$lib/image/scaler'
import { Transform } from '$lib/image/transform'
import { getContext, setContext } from 'svelte'

export interface ConversionConfig {
  scaleMode: ScaleMode
  transform: Transform
  backgroundColor: number
  ditheringKernel: DitheringKernel | null
  contrast: number
  bias: number
}

const ConversionConfigToken = Symbol('conversion-config')

export function getConversionConfig(): ConversionConfig {
  return getContext(ConversionConfigToken)
}

export function createConversionConfig() {
  const config = $state<ConversionConfig>({
    scaleMode: 'fit',
    transform: new Transform(),
    backgroundColor: 255,
    ditheringKernel: DEFAULT_DITHERING_KERNEL,
    contrast: 0,
    bias: 0,
  })

  return setContext(ConversionConfigToken, config)
}
