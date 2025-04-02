<script lang="ts">
  import { Input } from '$lib/components/ui/input'
  import { getBitmapContext } from '$lib/contexts/bitmap.svelte'
  import { toast } from 'svelte-sonner'

  const bitmapCtx = getBitmapContext()

  async function updateImageBitmap(fileList: FileList | null) {
    if (fileList === null || fileList.length < 1) {
      bitmapCtx.image = null
      return
    }

    const imageFile = fileList[0]
    try {
      bitmapCtx.image = await createImageBitmap(imageFile)
    } catch (e) {
      toast.error(`Error loading image file: ${e}`)
      bitmapCtx.image = null
    }
  }
</script>

<Input type="file" id="image-file" accept="image/*" onchange={e => updateImageBitmap(e.currentTarget.files)} />
