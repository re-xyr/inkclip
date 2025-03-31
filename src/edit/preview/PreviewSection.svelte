<script lang="ts">
  import PreviewCanvases from './PreviewCanvases.svelte'
  import FileSelect from './FileSelect.svelte'

  interface Props {
    bitmap: number[] | null
    onchange: (imageBitmap: ImageBitmap | null) => void
  }

  const { bitmap, onchange }: Props = $props()
</script>

<section class="flex flex-col gap-4">
  <h1 class="font-semibold text-xl/6">Choose an image</h1>
  <FileSelect {onchange} />
  <PreviewCanvases {bitmap} />
</section>
