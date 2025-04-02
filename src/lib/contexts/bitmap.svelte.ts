import { getContext, setContext } from 'svelte'
import type { ConversionConfig } from './config.svelte'
import { Quantizer } from '$lib/image/quantizer'
import { withTransform } from '$lib/image/transform'
import { Scaler } from '$lib/image/scaler'

const scaler = new Scaler(200, 200)

export interface BitmapContext {
  image: ImageBitmap | null
  rendered: number[] | null
}

export const BitmapContextToken = Symbol('bitmap')

export function getBitmapContext(): BitmapContext {
  return getContext(BitmapContextToken)
}

export function createBitmapContext(config: ConversionConfig): BitmapContext {
  const ctx: BitmapContext = $state({
    image: null,
    rendered: null,
  })

  const canvas = new OffscreenCanvas(200, 200)

  const quantizer = $derived(
    new Quantizer({
      ditheringKernel: config.ditheringKernel,
      contrast: config.contrast,
      bias: config.bias,
    })
  )

  $effect(() => {
    const bitmap = ctx.image

    if (bitmap === null) {
      ctx.rendered = null
      return
    }

    const canvasCtx = canvas.getContext('2d', {
      willReadFrequently: true,
    })!

    withTransform(canvasCtx, config.transform, () => {
      const nonNullBitmap = bitmap

      const bg = config.backgroundColor
      canvasCtx.fillStyle = `rgb(${bg} ${bg} ${bg})`
      canvasCtx.fillRect(0, 0, 200, 200)
      const { dx, dy, dWidth, dHeight } = scaler[config.scaleMode](nonNullBitmap)
      canvasCtx.drawImage(nonNullBitmap, dx, dy, dWidth, dHeight)
    })

    const quantizedData = quantizer.reduce(canvasCtx)
    ctx.rendered = quantizedData
  })

  return setContext(BitmapContextToken, ctx)
}
