<script lang="ts">
import { MediaQuery } from 'svelte/reactivity'
import AdaptivePreviewCanvas from './AdaptivePreviewCanvas.svelte'
import FileSelect from './FileSelect.svelte'
import PreviewCanvas from './PreviewCanvas.svelte'

const mediaSm = new MediaQuery('min-width: 640px', false)
</script>

<section class="stack gap-4" aria-labelledby="preview-section-label">
  <h2 class="text-xl/6 font-semibold" id="preview-section-label">Choose an image</h2>

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
