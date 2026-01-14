<script lang="ts">
import { Label } from '$lib/components/ui/label'
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '$lib/constants'
import { getConversionConfig } from '$lib/contexts/config.svelte'
import { getFilesContext } from '$lib/contexts/files.svelte'
import { getImageContext } from '$lib/contexts/image.svelte'
import { getRenderedContext } from '$lib/contexts/rendered.svelte'
import { cn } from '$lib/utils'
import IconHideImage from '~icons/material-symbols/hide-image'
import { drawQuantizedData, freshContext, makeAltText } from './common.svelte'

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

<div class="relative aspect-square w-full rounded-lg bg-[#ccc] p-2 shadow-md" role="group">
  <div
    class="size-full p-1 inset-shadow-sm inset-shadow-stone-400"
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
      <div class="col size-full justify-center text-[#333]">
        <IconHideImage class="text-5xl" aria-label="No image" />
      </div>
    {/if}
  </div>
</div>
