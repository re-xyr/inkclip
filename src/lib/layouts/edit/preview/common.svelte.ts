import { DEVICE_HEIGHT, DEVICE_WIDTH } from '$lib/constants'
import type { ConversionConfig } from '$lib/contexts/config.svelte'
import type { FilesContext } from '$lib/contexts/files.svelte'
import { imageIsCorrectRatio, type ImageContext } from '$lib/contexts/image.svelte'

export function freshContext(el: HTMLCanvasElement) {
  const ctx = el.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  return ctx
}

export function makeAltText(filesCtx: FilesContext, imageCtx: ImageContext, config: ConversionConfig): string {
  if (filesCtx.files.length < 1) return 'No image selected for e-paper preview'

  const file = filesCtx.files[0]

  const output = [`${DEVICE_WIDTH}-by-${DEVICE_HEIGHT}-pixels e-paper preview of "${file.name}"`]

  if (!imageIsCorrectRatio(imageCtx.image)) {
    if (config.scaleMode === 'fit') output.push('letterboxed')
    else if (config.scaleMode === 'crop') output.push('cropped to fit')
    else if (config.scaleMode === 'distort') output.push('stretched to fit')
  }

  if (config.transform.side === 'reverse') output.push('flipped horizontally')

  if (config.transform.rotation !== 0) output.push(`rotated ${config.transform.rotation} degrees`)

  if (config.ditheringKernel === null) output.push('no dithering')
  else output.push('with dithering')

  if (config.ditheringKernel !== null) {
    if (config.contrast >= 0.75) output.push('with very high contrast')
    else if (config.contrast >= 0.25) output.push('with high contrast')
  }

  if (config.contrast > 0 || config.ditheringKernel === null) {
    const biasScaleFactor = config.ditheringKernel === null ? 1 : config.contrast
    const scaledBias = config.bias * biasScaleFactor

    if (scaledBias >= 0.5) output.push('extremely biased towards black')
    else if (scaledBias >= 0.25) output.push('biased towards black')
    else if (scaledBias >= 0.1) output.push('slightly biased towards black')

    if (scaledBias <= -0.5) output.push('extremely biased towards white')
    else if (scaledBias <= -0.25) output.push('biased towards white')
    else if (scaledBias <= -0.1) output.push('slightly biased towards white')
  }

  return output.join(', ')
}

export function drawQuantizedData(ctx: CanvasRenderingContext2D, data: number[]) {
  const imageData = ctx.createImageData(DEVICE_WIDTH, DEVICE_HEIGHT)

  for (let y = 0; y < DEVICE_HEIGHT; y++) {
    for (let x = 0; x < DEVICE_WIDTH; x++) {
      const dataIx = y * DEVICE_WIDTH + x
      const bitmapIx = dataIx * 4
      const colorIx = data.at(dataIx)
      const color = colorIx === 0 ? 0xcc : 0x11

      imageData.data[bitmapIx] = color
      imageData.data[bitmapIx + 1] = color
      imageData.data[bitmapIx + 2] = color
      imageData.data[bitmapIx + 3] = 0xff
    }
  }
  ctx.putImageData(imageData, 0, 0)
}
