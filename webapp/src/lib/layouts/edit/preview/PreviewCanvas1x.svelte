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
  <div class="bg-[#ccc] shadow-md rounded-lg p-2 w-fit relative" role="group" aria-labelledby="preview-1x-label">
    <div class="p-[3px] shadow-sm shadow-[inset#888]" role="img" aria-label={makeAltText(filesCtx, imageCtx, config)}>
      {#if hasRendered}
        <canvas
          class={cn(hasRendered || 'hidden')}
          style:image-rendering="pixelated"
          style:width="{DEVICE_WIDTH}px"
          style:height="{DEVICE_HEIGHT}px"
          bind:this={canvasEl}
          height={DEVICE_HEIGHT}
          width={DEVICE_WIDTH}
        ></canvas>
      {:else}
        <div class="col justify-center text-[#333]" style:width="{DEVICE_WIDTH}px" style:height="{DEVICE_HEIGHT}px">
          <IconHideImage class="text-3xl" aria-label="No image" />
        </div>
      {/if}
    </div>
  </div>

  <Label id="preview-1x-label">1x Preview</Label>
</div>
