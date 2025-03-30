<script lang="ts">
  import { Transform, withCtx, withTransform } from './image/transform'
  import { Quantizer, type DitheringKernel } from './image/quantizer'
  import { Scaler, type ScaleMode } from './image/scaler'

  interface Props {
    onchange: (bitmap: number[] | null) => void
  }

  const scaler = new Scaler(200, 200)

  const { onchange }: Props = $props()

  let scaledCanvasEl: HTMLCanvasElement
  let unscaledCanvasEl: HTMLCanvasElement

  let fileList: FileList | null = $state(null)
  let imageBitmap: ImageBitmap | null = $state(null)

  let backgroundColor: number = $state(255)

  let imageState: Transform = $state(new Transform())
  let scalingMethod: ScaleMode = $state('fit')

  let dither = $state(true)
  let ditheringKernel: DitheringKernel = $state('FloydSteinberg')

  let saturation = $state(0)
  let bias = $state(0)

  const quantizer = $derived(
    new Quantizer({
      ditheringKernel: dither ? ditheringKernel : null,
      saturation,
      bias,
    }),
  )

  function imageNonSquare() {
    if (imageBitmap === null) return false
    return imageBitmap.height !== imageBitmap.width
  }

  function restoreDefaultImageSettings() {
    backgroundColor = 255
    imageState = new Transform()
    scalingMethod = 'fit'
    dither = true
    ditheringKernel = 'FloydSteinberg'
    saturation = 0
    bias = 0
  }

  function freshContext() {
    const ctx = scaledCanvasEl.getContext('2d', {
      willReadFrequently: true,
    })!
    ctx.clearRect(0, 0, 200, 200)
    return ctx
  }

  function drawQuantizedData(ctx: CanvasRenderingContext2D, data: number[]) {
    withCtx(
      ctx,
      () => {
        ctx.imageSmoothingEnabled = false
      },
      () => {
        for (let y = 0; y < 200; y++) {
          for (let x = 0; x < 200; x++) {
            const color = data.at(y * 200 + x)
            ctx.fillStyle = color === 0 ? '#fff' : '#000'
            ctx.fillRect(x, y, 1, 1)
          }
        }
      },
    )
  }

  async function updateImageBitmap() {
    if (fileList === null || fileList.length < 1) {
      imageBitmap = null
      return
    }

    const imageFile = fileList[0]
    try {
      imageBitmap = await createImageBitmap(imageFile)
    } catch (e) {
      console.error(e)
      imageBitmap = null
    }
    imageState = new Transform()
  }

  async function drawToCanvas() {
    const ctx = freshContext()

    if (imageBitmap === null) {
      onchange(null)
      return
    }

    withTransform(ctx, imageState, () => {
      if (imageBitmap === null) return

      ctx.fillStyle = `rgb(${backgroundColor} ${backgroundColor} ${backgroundColor})`
      ctx.fillRect(0, 0, 200, 200)
      const { dx, dy, dWidth, dHeight } = scaler.scale(imageBitmap, scalingMethod)
      ctx.drawImage(imageBitmap, dx, dy, dWidth, dHeight)
    })

    const quantizedData = quantizer.reduce(ctx)
    drawQuantizedData(ctx, quantizedData)
    drawQuantizedData(unscaledCanvasEl.getContext('2d')!, quantizedData)

    onchange(quantizedData)
  }

  $effect(() => {
    updateImageBitmap()
  })

  $effect(() => {
    drawToCanvas()
  })
</script>

<div class="canvas-container">
  <div>
    <input type="file" id="image-file" name="image_file" accept="image/*" bind:files={fileList} />
    <canvas class="scaled" bind:this={scaledCanvasEl} height={200} width={200}></canvas>
    <canvas bind:this={unscaledCanvasEl} height={200} width={200}></canvas>
  </div>

  <div>
    {#if imageNonSquare()}
      <div>
        <h2>Scaling</h2>
        You need to choose how to scale your image since it is not square.
        <br />
        <select name="scaling_method" id="scaling-method-select" bind:value={scalingMethod}>
          <option value="fit">Fit</option>
          <option value="crop">Crop</option>
          <option value="distort">Distort</option>
        </select>
      </div>
    {/if}

    <div class="transforms">
      <h2>Transform</h2>

      <button
        onclick={() => {
          imageState = imageState.cw()
        }}
        name="Rotate clockwise"
      >
        ↻
      </button>
      <button
        onclick={() => {
          imageState = imageState.ccw()
        }}
        name="Rotate counter-clockwise"
      >
        ↺
      </button>
      <button
        onclick={() => {
          imageState = imageState.h()
        }}
        name="Flip horizontally"
      >
        ↔
      </button>
      <button
        onclick={() => {
          imageState = imageState.v()
        }}
        name="Flip vertically"
      >
        ↕
      </button>
    </div>

    <div>
      <h2>Rendering</h2>
      Background Color:<input
        type="range"
        name="background_color"
        id="background-color-input"
        bind:value={backgroundColor}
        min={0}
        max={255}
        step={1}
      />
      {backgroundColor}
      <br />
      <input type="checkbox" name="dither" id="dither-checkbox" bind:checked={dither} /> Dither
      {#if dither}
        <br />
        Dithering Kernel:
        <select name="dithering_kernel" id="dithering-kernel-select" bind:value={ditheringKernel}>
          <option value="FloydSteinberg">Floyd-Steinberg</option>
          <option value="FalseFloydSteinberg">False Floyd-Steinberg</option>
          <option value="Stucki">Stucki</option>
          <option value="Atkinson">Atkinson</option>
          <option value="Jarvis">Jarvis</option>
          <option value="Burkes">Burkes</option>
          <option value="Sierra">Sierra</option>
          <option value="TwoSierra">2-Sierra</option>
          <option value="SierraLite">Sierra Lite</option>
        </select>
        <br />
        Saturation:
        <input
          type="range"
          name="saturation"
          id="saturation-input"
          bind:value={saturation}
          min={0}
          max={1}
          step={0.01}
        />
        {Math.floor(saturation * 100)}%
      {/if}

      {#if !dither || saturation !== 0}
        <br />
        Bias:
        <input type="range" name="bias" id="bias-input" bind:value={bias} min={-1} max={1} step={0.01} />
        {Math.floor(bias * 100)}%
      {/if}

      <br />
      (white = {Math.floor(quantizer.white)}, black = {Math.floor(quantizer.black)})
    </div>

    <div>
      <h2>Reset</h2>
      <button onclick={restoreDefaultImageSettings}>Reset All</button>
    </div>
  </div>
</div>

<style>
  canvas {
    display: block;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }

  .scaled {
    width: 400px;
    height: 400px;
  }

  .canvas-container {
    display: flex;
    gap: 20px;
  }

  .transforms button {
    font-family: sans-serif;
    font-size: 32px;
  }

  h2 {
    font-size: 1.3em;
  }
</style>
