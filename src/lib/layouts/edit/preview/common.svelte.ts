export function freshContext(el: HTMLCanvasElement) {
  const ctx = el.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  return ctx
}

export function drawQuantizedData(ctx: CanvasRenderingContext2D, data: number[]) {
  const imageData = ctx.createImageData(200, 200)

  for (let y = 0; y < 200; y++) {
    for (let x = 0; x < 200; x++) {
      const colorIx = data.at(y * 200 + x)
      const color = colorIx === 0 ? 0xcc : 0x11

      imageData.data[y * 800 + x * 4] = color
      imageData.data[y * 800 + x * 4 + 1] = color
      imageData.data[y * 800 + x * 4 + 2] = color
      imageData.data[y * 800 + x * 4 + 3] = 0xff
    }
  }
  ctx.putImageData(imageData, 0, 0)
}
