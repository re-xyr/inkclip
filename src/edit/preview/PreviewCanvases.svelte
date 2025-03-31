<script lang="ts">
  import { Label } from '$lib/components/ui/label'
  import { withCtx } from '$lib/image/transform'

  interface Props {
    bitmap: number[] | null
  }

  const { bitmap }: Props = $props()

  let canvas2xEl: HTMLCanvasElement
  let canvas1xEl: HTMLCanvasElement

  function freshContext(el: HTMLCanvasElement) {
    const ctx = el.getContext('2d')!
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
            ctx.fillStyle = color === 0 ? '#ccc' : '#111'
            ctx.fillRect(x, y, 1, 1)
          }
        }
      },
    )
  }

  $effect(() => {
    const context2x = freshContext(canvas2xEl)
    const context1x = freshContext(canvas1xEl)

    if (bitmap === null) return

    drawQuantizedData(context2x, bitmap)
    drawQuantizedData(context1x, bitmap)
  })
</script>

<div class="flex gap-4 max-md:flex-col">
  <div>
    <div id="canvas-2x" class="bg-[#ccc] shadow-md rounded-2xl p-4 w-fit">
      <canvas
        class="border-[1px] border-[#888] w-[402px] h-[402px]"
        style="image-rendering: pixelated"
        bind:this={canvas2xEl}
        height={200}
        width={200}
      ></canvas>
    </div>
    <Label for="canvas-2x">2x Preview</Label>
  </div>

  <div>
    <div id="preview-1x" class="bg-[#ccc] shadow-md rounded-lg p-2 w-fit">
      <canvas
        class="border-[1px] border-[#888] w-[202px] h-[202px]"
        style="image-rendering: pixelated"
        bind:this={canvas1xEl}
        height={200}
        width={200}
      ></canvas>
    </div>
    <Label for="canvas-1x">1x Preview</Label>
  </div>
</div>
