import { getContext, setContext } from 'svelte'
import type { ImageContext } from './image.svelte'
import { withTransform } from '$lib/image/transform'
import type { ConversionConfig } from './config.svelte'
import { Scaler } from '$lib/image/scaler'
import { Quantizer } from '$lib/image/quantizer'

export interface RenderedContext {
  rendered: number[] | null
}

export const RenderedContextToken = Symbol('rendered')

export function getRenderedContext(): Readonly<RenderedContext> {
  return getContext(RenderedContextToken)
}

const scaler = new Scaler(200, 200)

export function createRenderedContext(
  imageCtx: Readonly<ImageContext>,
  config: ConversionConfig
): Readonly<RenderedContext> {
  const ctx: RenderedContext = $state({
    rendered: null,
  })

  const quantizer = $derived(
    new Quantizer({
      ditheringKernel: config.ditheringKernel,
      contrast: config.contrast,
      bias: config.bias,
    })
  )

  const canvas = new OffscreenCanvas(200, 200)
  const canvasCtx = canvas.getContext('2d', {
    willReadFrequently: true,
  })!

  $effect(() => {
    const bitmap = imageCtx.image

    if (bitmap === null) {
      ctx.rendered = null
      return
    }

    withTransform(canvasCtx, config.transform, () => {
      const bg = config.backgroundColor
      canvasCtx.fillStyle = `rgb(${bg} ${bg} ${bg})`
      canvasCtx.fillRect(0, 0, 200, 200)
      const { dx, dy, dWidth, dHeight } = scaler.scale(config.scaleMode, bitmap)
      canvasCtx.drawImage(bitmap, dx, dy, dWidth, dHeight)
    })

    const quantizedData = quantizer.reduce(canvasCtx)
    ctx.rendered = quantizedData
  })

  return setContext(RenderedContextToken, ctx)
}
