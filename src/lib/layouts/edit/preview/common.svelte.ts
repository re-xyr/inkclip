import { INKCLIP_HEIGHT, INKCLIP_WIDTH } from '$lib/constants'

export function freshContext(el: HTMLCanvasElement) {
  const ctx = el.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  return ctx
}

export function drawQuantizedData(ctx: CanvasRenderingContext2D, data: number[]) {
  const imageData = ctx.createImageData(INKCLIP_WIDTH, INKCLIP_HEIGHT)

  for (let y = 0; y < INKCLIP_HEIGHT; y++) {
    for (let x = 0; x < INKCLIP_WIDTH; x++) {
      const dataIx = y * INKCLIP_WIDTH + x
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
