<script lang="ts">
  import IconEditOff from '~icons/material-symbols/edit-off'

  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils'

  import { DEFAULT_DITHERING_KERNEL } from '$lib/image/quantizer'
  import { Transform } from '$lib/image/transform'

  import { Button } from '$lib/components/ui/button'
  import Separator from '$lib/components/ui/separator/separator.svelte'

  import AspectRatioAlert from './dimensions/AspectRatioAlert.svelte'
  import ScaleModeToggleGroup from './dimensions/ScaleModeToggleGroup.svelte'
  import TransformControls from './dimensions/TransformControls.svelte'
  import BackgroundColorSlider from './BackgroundColorSlider.svelte'
  import DitherControls from './conversion/dither/DitherControls.svelte'
  import ContrastSlider from './conversion/ContrastSlider.svelte'
  import BiasSlider from './conversion/BiasSlider.svelte'
  import { getBitmapContext } from '$lib/contexts/bitmap.svelte'
  import { getConversionConfig } from '$lib/contexts/config.svelte'

  interface Props extends HTMLAttributes<HTMLElement> {}

  const { class: className, ...restProps }: Props = $props()

  const bitmapCtx = getBitmapContext()
  const config = getConversionConfig()

  const transformDisabled = $derived(bitmapCtx.image === null)

  function imageNonSquare() {
    if (bitmapCtx.image === null) return false
    return bitmapCtx.image.height !== bitmapCtx.image.width
  }

  function restoreDefaultImageSettings() {
    config.scaleMode = 'fit'
    config.transform = new Transform()
    config.backgroundColor = 255
    config.ditheringKernel = DEFAULT_DITHERING_KERNEL
    config.contrast = 0
    config.bias = 0
  }
</script>

<section class={cn('flex flex-col gap-4', className)} {...restProps}>
  <h1 class="font-semibold text-xl/6">Edit image</h1>

  {#if imageNonSquare()}
    <AspectRatioAlert />
  {/if}

  <div class="flex gap-4">
    {#if imageNonSquare()}
      <ScaleModeToggleGroup />
    {/if}

    <TransformControls disabled={transformDisabled} />
  </div>

  <Separator />

  <BackgroundColorSlider />

  <Separator />

  <DitherControls />

  {#if config.ditheringKernel !== null}
    <ContrastSlider />
  {/if}

  {#if config.ditheringKernel === null || config.contrast !== 0}
    <BiasSlider />
  {/if}

  <Separator />

  <Button variant="secondary" class="w-full" onclick={restoreDefaultImageSettings}>
    <IconEditOff />
    Reset All
  </Button>
</section>
