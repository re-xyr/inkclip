<script lang="ts">
  import { Input } from '$lib/components/ui/input'
  import { toast } from 'svelte-sonner'

  interface Props {
    onchange: (imageBitmap: ImageBitmap | null) => void
  }

  const { onchange }: Props = $props()

  let fileList: FileList | undefined = $state()

  async function updateImageBitmap() {
    if (fileList === undefined || fileList.length < 1) {
      onchange(null)
      return
    }

    const imageFile = fileList[0]
    try {
      onchange(await createImageBitmap(imageFile))
    } catch (e) {
      toast.error(`Error loading image file: ${e}`)
      onchange(null)
    }
  }

  $effect(() => {
    updateImageBitmap()
  })
</script>

<Input type="file" id="image-file" accept="image/*" bind:files={fileList} />
