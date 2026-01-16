<script lang="ts">
import { getDeviceContext } from '$lib/contexts/device.svelte'
import { getFilesContext } from '$lib/contexts/files.svelte'
import { cn } from '$lib/utils'
import { MediaQuery } from 'svelte/reactivity'
import AdaptivePreviewCanvas from './AdaptivePreviewCanvas.svelte'
import FileSelect from './FileSelect.svelte'
import PreviewCanvas from './PreviewCanvas.svelte'

const mediaSm = new MediaQuery('min-width: 640px', false)
const deviceCtx = getDeviceContext()
const filesCtx = getFilesContext()
</script>

<section class="stack gap-4" aria-labelledby="preview-section-label">
  <h2
    class={cn(
      'text-xl/6 font-semibold transition-all',
      (deviceCtx.device && !filesCtx.files.length) || 'font-normal opacity-50',
    )}
    id="preview-section-label"
  >
    Choose an image
  </h2>

  <FileSelect />

  <div class="stack-h flex-wrap gap-4">
    {#if mediaSm.current}
      <PreviewCanvas scale={2} />
      <PreviewCanvas scale={1} />
    {:else}
      <AdaptivePreviewCanvas />
    {/if}
  </div>
</section>
