export type DrawParameters = {
  dx: number
  dy: number
  dWidth: number
  dHeight: number
}

export type ScaleMode = 'fit' | 'crop' | 'distort'

export class Scaler {
  private readonly canvasAspectRatio: number

  constructor(private readonly canvasWidth: number, private readonly canvasHeight: number) {
    this.canvasAspectRatio = canvasWidth / canvasHeight
  }

  fitScale(image: ImageBitmap): DrawParameters {
    const { width, height } = image
    const aspectRatio = width / height

    let dx = 0
    let dy = 0
    let dWidth = this.canvasWidth
    let dHeight = this.canvasHeight

    if (aspectRatio > this.canvasAspectRatio) {
      dHeight = dWidth / aspectRatio
      dy = (this.canvasHeight - dHeight) / 2
    } else if (aspectRatio < this.canvasAspectRatio) {
      dWidth = dHeight * aspectRatio
      dx = (this.canvasWidth - dWidth) / 2
    }

    return {
      dx,
      dy,
      dWidth,
      dHeight,
    }
  }

  cropScale(image: ImageBitmap): DrawParameters {
    const { width, height } = image
    const aspectRatio = width / height

    let dx = 0
    let dy = 0
    let dWidth = this.canvasWidth
    let dHeight = this.canvasHeight

    if (aspectRatio > this.canvasAspectRatio) {
      dWidth = dHeight * aspectRatio
      dx = (this.canvasWidth - dWidth) / 2
    } else if (aspectRatio < this.canvasAspectRatio) {
      dHeight = dWidth / aspectRatio
      dy = (this.canvasHeight - dHeight) / 2
    }

    return {
      dx,
      dy,
      dWidth,
      dHeight,
    }
  }

  distortScale(): DrawParameters {
    return {
      dx: 0,
      dy: 0,
      dWidth: this.canvasWidth,
      dHeight: this.canvasHeight,
    }
  }

  scale(image: ImageBitmap, mode: ScaleMode) {
    switch (mode) {
      case 'crop':
        return this.cropScale(image)
      case 'fit':
        return this.fitScale(image)
      case 'distort':
        return this.distortScale()
    }
  }
}
