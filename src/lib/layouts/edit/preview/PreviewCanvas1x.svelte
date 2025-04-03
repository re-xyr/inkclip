<script lang="ts">
  import { Label } from '$lib/components/ui/label'
  import IconHideImage from '~icons/material-symbols/hide-image'

  import { cn } from '$lib/utils'
  import { drawQuantizedData, freshContext } from './common.svelte'
  import { getRenderedContext } from '$lib/contexts/rendered.svelte'
  import { INKCLIP_HEIGHT, INKCLIP_WIDTH } from '$lib/constants'

  const renderedCtx = getRenderedContext()
  const hasRendered = $derived(renderedCtx.rendered !== null)

  let canvasEl!: HTMLCanvasElement

  const ctx = $derived(freshContext(canvasEl))

  $effect(() => {
    if (renderedCtx.rendered === null) return
    drawQuantizedData(ctx, renderedCtx.rendered)
  })
</script>

<div>
  <div class="bg-[#ccc] shadow-md rounded-lg p-2 w-fit relative" role="img" aria-labelledby="preview-1x-label">
    <div class="p-[3px] border-[1px] border-[#888]">
      <canvas
        class={cn(hasRendered || 'hidden')}
        style:image-rendering="pixelated"
        style:width="{INKCLIP_WIDTH}px"
        style:height="{INKCLIP_HEIGHT}px"
        bind:this={canvasEl}
        height={INKCLIP_HEIGHT}
        width={INKCLIP_WIDTH}
      ></canvas>

      {#if !hasRendered}
        <div class="col justify-center text-muted" style:width="{INKCLIP_WIDTH}px" style:height="{INKCLIP_HEIGHT}px">
          <IconHideImage class="text-3xl" aria-label="No image" />
        </div>
      {/if}
    </div>
  </div>

  <Label id="preview-1x-label">1x Preview</Label>
</div>
