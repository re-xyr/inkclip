<script lang="ts">
  import { Label } from '$lib/components/ui/label'
  import IconUploadFile from '~icons/material-symbols/upload-file'

  import { cn } from '$lib/utils'
  import { drawQuantizedData, freshContext } from './common.svelte'
  import { getFilesContext } from '$lib/contexts/files.svelte'
  import { getRenderedContext } from '$lib/contexts/rendered.svelte'

  interface Props {
    fileInputEl: HTMLInputElement | null
  }

  const { fileInputEl }: Props = $props()

  const filesCtx = getFilesContext()
  const renderedCtx = getRenderedContext()
  const hasRendered = $derived(renderedCtx.rendered !== null)

  let canvasEl!: HTMLCanvasElement

  const ctx = $derived(freshContext(canvasEl))

  let fileOverDragZone = $state(false)

  $effect(() => {
    if (renderedCtx.rendered === null) return
    drawQuantizedData(ctx, renderedCtx.rendered)
  })
</script>

<div>
  <div
    ondragover={e => e.preventDefault()}
    ondrop={e => {
      e.preventDefault()
      const files = e.dataTransfer?.files
      if (files) filesCtx.files = files
    }}
    class="bg-[#ccc] shadow-md rounded-2xl p-4 w-fit relative"
    role="img"
    aria-labelledby="preview-2x-label"
  >
    <div class="p-[6px] border-[1px] border-[#888]">
      <canvas
        class={cn('w-[400px] h-[400px]', hasRendered || 'hidden')}
        style:image-rendering="pixelated"
        bind:this={canvasEl}
        height={200}
        width={200}
      ></canvas>
      {#if !hasRendered}
        <button
          onclick={() => fileInputEl?.showPicker()}
          ondragleave={() => (fileOverDragZone = false)}
          ondragover={() => (fileOverDragZone = true)}
          class={cn(
            'col justify-center w-[400px] h-[400px] rounded-xl hover:cursor-pointer text-muted',
            fileOverDragZone && 'outline-dashed',
          )}
          tabindex={-1}
          aria-label="Choose file"
        >
          <IconUploadFile class="text-3xl" aria-hidden />
          <div class="font-medium">Drop file</div>
        </button>
      {/if}
    </div>
  </div>
  <Label id="preview-2x-label">2x Preview</Label>
</div>
