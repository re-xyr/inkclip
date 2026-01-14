import { DEVICE_HEIGHT, DEVICE_WIDTH } from '$lib/constants'
import { Quantizer } from '$lib/image/quantizer'
import { Scaler } from '$lib/image/scaler'
import { withTransform } from '$lib/image/transform'
import { getContext, setContext } from 'svelte'
import type { ConversionConfig } from './config.svelte'
import type { ImageContext } from './image.svelte'

export class RenderedContext {
  rendered: Uint8Array | null = $state(null)
}

export const RenderedContextToken = Symbol('rendered')

export function getRenderedContext(): Readonly<RenderedContext> {
  return getContext(RenderedContextToken)
}

const scaler = new Scaler(DEVICE_WIDTH, DEVICE_HEIGHT)

export function createRenderedContext(
  imageCtx: Readonly<ImageContext>,
  config: ConversionConfig,
): Readonly<RenderedContext> {
  const ctx: RenderedContext = new RenderedContext()

  const quantizer = $derived(
    new Quantizer({
      ditheringKernel: config.ditheringKernel,
      contrast: config.contrast,
      brightness: config.brightness,
    }),
  )

  const canvas = new OffscreenCanvas(DEVICE_WIDTH, DEVICE_HEIGHT)
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
      canvasCtx.fillRect(0, 0, DEVICE_WIDTH, DEVICE_HEIGHT)
      const { dx, dy, dWidth, dHeight } = scaler.scale(config.scaleMode, bitmap)
      canvasCtx.drawImage(bitmap, dx, dy, dWidth, dHeight)
    })

    const quantizedData = quantizer.reduce(canvasCtx)
    ctx.rendered = Uint8Array.from(quantizedData)
  })

  return setContext(RenderedContextToken, ctx)
}
