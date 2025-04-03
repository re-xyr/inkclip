<script lang="ts">
  import { Label } from '$lib/components/ui/label'
  import IconHideImage from '~icons/material-symbols/hide-image'

  import { cn } from '$lib/utils'
  import { drawQuantizedData, freshContext } from './common.svelte'
  import { getRenderedContext } from '$lib/contexts/rendered.svelte'

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
        class={cn('w-[200px] h-[200px]', hasRendered || 'hidden')}
        style:image-rendering="pixelated"
        bind:this={canvasEl}
        height={200}
        width={200}
      ></canvas>

      {#if !hasRendered}
        <div class="col justify-center w-[200px] h-[200px] text-muted">
          <IconHideImage class="text-3xl" aria-label="No image" />
        </div>
      {/if}
    </div>
  </div>

  <Label id="preview-1x-label">1x Preview</Label>
</div>
