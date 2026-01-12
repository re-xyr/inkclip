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

interface Props {
  scale: number
}

const { scale }: Props = $props()

let canvasEl: HTMLCanvasElement = $state(undefined!)

const ctx = $derived(freshContext(canvasEl))

$effect(() => {
  if (renderedCtx.rendered === null) return
  drawQuantizedData(ctx, renderedCtx.rendered)
})
</script>

<div>
  <div
    class="bg-[#ccc] shadow-md rounded-lg p-2 w-fit relative mb-1"
    role="group"
    aria-labelledby="preview-{scale}x-label"
  >
    <div
      class="inset-shadow-sm inset-shadow-stone-400"
      style:padding="{scale * 3}px"
      role="img"
      aria-label={makeAltText(filesCtx, imageCtx, config)}
    >
      <div class="aspect-square" style:width="{DEVICE_WIDTH * scale}px">
        {#if hasRendered}
          <canvas
            class={cn('size-full', hasRendered || 'hidden')}
            style:image-rendering="pixelated"
            bind:this={canvasEl}
            height={DEVICE_HEIGHT}
            width={DEVICE_WIDTH}
          ></canvas>
        {:else}
          <div class="col justify-center text-[#333] size-full">
            <IconHideImage style="font-size: {30 * scale}px" aria-label="No image" />
          </div>
        {/if}
      </div>
    </div>
  </div>

  <Label id="preview-{scale}x-label">{scale}x Preview</Label>
</div>
