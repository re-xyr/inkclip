export type Rotation = 0 | 90 | 180 | 270
export type Side = 'obverse' | 'reverse'
export type Operation = 'cw' | 'ccw' | 'h' | 'v'

/**
 * A transform of a square image is represented by first rotating it by a multiple of 90 degrees, and then optionally
 * flipping it horizontally.
 *
 * Algebraically, this is the dihedral group of order 8 (D₄).
 */
export class Transform {
  constructor(public readonly side: Side = 'obverse', public readonly rotation: Rotation = 0) {}

  cw(): Transform {
    const rotationAngle = this.side === 'obverse' ? 90 : 270
    const newAngle = (this.rotation + rotationAngle) % 360
    return new Transform(this.side, newAngle as Rotation)
  }

  ccw(): Transform {
    const rotationAngle = this.side === 'obverse' ? 270 : 90
    const newAngle = (this.rotation + rotationAngle) % 360
    return new Transform(this.side, newAngle as Rotation)
  }

  h(): Transform {
    const newSide = this.side == 'obverse' ? 'reverse' : 'obverse'
    return new Transform(newSide, this.rotation)
  }

  v(): Transform {
    const newSide = this.side == 'obverse' ? 'reverse' : 'obverse'
    const newAngle = (this.rotation + 180) % 360
    return new Transform(newSide, newAngle as Rotation)
  }

  op(op: Operation): Transform {
    return this[op]()
  }
}

export type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

function withCtx<T>(ctx: Context2D, pre: () => void, action: () => T): T {
  ctx.save()
  try {
    pre()
    return action()
  } finally {
    ctx.restore()
  }
}

export function withTransform<T>(ctx: Context2D, transform: Transform, action: () => T): T {
  return withCtx(
    ctx,
    () => {
      ctx.translate(100, 100)
      if (transform.side === 'reverse') {
        ctx.scale(-1, 1)
      }
      ctx.rotate((transform.rotation / 180) * Math.PI)
      ctx.translate(-100, -100)
    },
    action
  )
}
