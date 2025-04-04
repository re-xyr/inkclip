<script lang="ts">
  import { Label } from '$lib/components/ui/label'
  import IconHideImage from '~icons/material-symbols/hide-image'

  import { cn } from '$lib/utils'
  import { drawQuantizedData, freshContext, makeAltText } from './common.svelte'
  import { getRenderedContext } from '$lib/contexts/rendered.svelte'
  import { DEVICE_HEIGHT, DEVICE_WIDTH } from '$lib/constants'
  import { getFilesContext } from '$lib/contexts/files.svelte'
  import { getConversionConfig } from '$lib/contexts/config.svelte'
  import { getImageContext } from '$lib/contexts/image.svelte'

  const filesCtx = getFilesContext()
  const imageCtx = getImageContext()
  const config = getConversionConfig()
  const renderedCtx = getRenderedContext()
  const hasRendered = $derived(renderedCtx.rendered !== null)

  let canvasEl: HTMLCanvasElement = $state(undefined!)

  const ctx = $derived(freshContext(canvasEl))

  $effect(() => {
    if (renderedCtx.rendered === null) return
    drawQuantizedData(ctx, renderedCtx.rendered)
  })
</script>

<div>
  <div class="bg-[#ccc] shadow-lg rounded-2xl p-4 w-fit relative" role="group" aria-labelledby="preview-2x-label">
    <div class="p-[6px] shadow shadow-[inset#888]" role="img" aria-label={makeAltText(filesCtx, imageCtx, config)}>
      {#if hasRendered}
        <canvas
          class={cn(hasRendered || 'hidden')}
          style:image-rendering="pixelated"
          style:width="{DEVICE_WIDTH * 2}px"
          style:height="{DEVICE_HEIGHT * 2}px"
          bind:this={canvasEl}
          height={DEVICE_HEIGHT}
          width={DEVICE_WIDTH}
        ></canvas>
      {:else}
        <div
          class="col justify-center text-[#333]"
          style:width="{DEVICE_WIDTH * 2}px"
          style:height="{DEVICE_HEIGHT * 2}px"
        >
          <IconHideImage class="text-6xl" aria-label="No image" />
        </div>
      {/if}
    </div>
  </div>
  <Label id="preview-2x-label">2x Preview</Label>
</div>
