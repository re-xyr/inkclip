export type DitheringKernel =
  | 'FloydSteinberg'
  | 'FalseFloydSteinberg'
  | 'Stucki'
  | 'Atkinson'
  | 'Jarvis'
  | 'Burkes'
  | 'Sierra'
  | 'TwoSierra'
  | 'SierraLite'

export type Rgb = [number, number, number]

export type RgbQuantOptions = {
  colors?: number
  method?: 1 | 2
  boxSize?: [number, number]
  boxPxls?: number
  initColors?: number
  minHueCols?: number
  dithKern?: DitheringKernel | null
  dithDelta?: number
  dithSerp?: boolean
  palette?: Rgb[]
  reIndex?: boolean
  useCache?: boolean
  cacheFreq?: number
  colorDist?: 'euclidean' | 'manhattan'
}

export type RgbQuantImage =
  | HTMLImageElement
  | HTMLCanvasElement
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D
  | ImageData
  | Uint8Array
  | Uint8ClampedArray
  | Uint32Array
  | number[]

export default class RgbQuant {
  constructor(opts?: RgbQuantOptions)
  sample(image: RgbQuantImage, width?: number): void
  palette(tuples: true, noSort?: boolean = false): Rgb[]
  palette(tuples: false, noSort?: boolean = false): Uint8Array
  palette(): Uint8Array
  reduce(
    image: RgbQuantImage,
    retType: 1,
    dithKern?: DitheringKernel | null,
    dithSerp?: boolean,
  ): Uint8Array
  reduce(
    image: RgbQuantImage,
    retType: 2,
    dithKern?: DitheringKernel | null,
    dithSerp?: boolean,
  ): number[]
}
