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

<div class="bg-[#ccc] shadow-md rounded-lg p-2 w-full aspect-square relative" role="group">
  <div
    class="inset-shadow-sm inset-shadow-stone-400 p-1 size-full"
    role="img"
    aria-label={makeAltText(filesCtx, imageCtx, config)}
  >
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
        <IconHideImage class="text-5xl" aria-label="No image" />
      </div>
    {/if}
  </div>
</div>
