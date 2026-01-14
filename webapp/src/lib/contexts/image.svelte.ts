import { DEVICE_HEIGHT, DEVICE_WIDTH } from '$lib/constants'
import { getContext, setContext } from 'svelte'
import { toast } from 'svelte-sonner'
import type { FilesContext } from './files.svelte'

export interface ImageContext {
  image: ImageBitmap | null
}

export const ImageContextToken = Symbol('image')

export function getImageContext(): Readonly<ImageContext> {
  return getContext(ImageContextToken)
}

export function createImageContext(filesCtx: FilesContext): Readonly<ImageContext> {
  const ctx: ImageContext = $state({
    image: null,
  })

  async function updateImageBitmap() {
    const files = filesCtx.files

    if (files === null || files.length < 1) {
      ctx.image = null
      return
    }

    try {
      ctx.image = await createImageBitmap(files[0])
    } catch (e) {
      toast.error(`Error loading image file: ${e}`)
      ctx.image = null
    }
  }

  $effect(() => {
    updateImageBitmap()
  })

  return setContext(ImageContextToken, ctx)
}

export function imageIsCorrectRatio(image: ImageBitmap | null): boolean {
  if (image === null) return true
  return image.height * DEVICE_WIDTH === image.width * DEVICE_HEIGHT
}
