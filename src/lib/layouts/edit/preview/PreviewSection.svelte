<script lang="ts">
  import PreviewCanvases from './PreviewCanvases.svelte'
  import FileSelect from './FileSelect.svelte'
</script>

<section class="flex flex-col gap-4">
  <h1 class="font-semibold text-xl/6">Choose an image</h1>
  <FileSelect />
  <PreviewCanvases />
</section>
