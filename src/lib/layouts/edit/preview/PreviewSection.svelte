<script lang="ts">
  import FileSelect from './FileSelect.svelte'
  import PreviewCanvas1x from './PreviewCanvas1x.svelte'
  import PreviewCanvas2x from './PreviewCanvas2x.svelte'

  let fileInputEl: HTMLInputElement | null = $state(null)
</script>

<section class="stack gap-4" aria-labelledby="preview-section-label">
  <h2 class="font-semibold text-xl/6" id="preview-section-label">Choose an image</h2>

  <FileSelect bind:ref={fileInputEl} />

  <div class="stack-h gap-4 max-md:stack">
    <PreviewCanvas2x {fileInputEl} />
    <PreviewCanvas1x />
  </div>
</section>
