<script lang="ts">
  import IconEditOff from '~icons/material-symbols/edit-off'

  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils'

  import { DEFAULT_DITHERING_KERNEL, type DitheringKernel } from '$lib/image/quantizer'
  import type { ScaleMode } from '$lib/image/scaler'
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

  interface Props extends HTMLAttributes<HTMLElement> {
    imageBitmap: ImageBitmap | null
    scaleMode: ScaleMode
    transform: Transform
    backgroundColor: number
    ditheringKernel: DitheringKernel | null
    contrast: number
    bias: number
  }

  let {
    imageBitmap,
    scaleMode = $bindable(),
    transform = $bindable(),
    backgroundColor = $bindable(),
    ditheringKernel = $bindable(),
    contrast = $bindable(),
    bias = $bindable(),
    class: className,
    ...restProps
  }: Props = $props()

  const transformDisabled = $derived(imageBitmap === null)

  function imageNonSquare() {
    if (imageBitmap === null) return false
    return imageBitmap.height !== imageBitmap.width
  }

  function restoreDefaultImageSettings() {
    scaleMode = 'fit'
    transform = new Transform()
    backgroundColor = 255
    ditheringKernel = DEFAULT_DITHERING_KERNEL
    contrast = 0
    bias = 0
  }
</script>

<section class={cn('flex flex-col gap-4', className)} {...restProps}>
  <h1 class="font-semibold text-xl/6">Edit image</h1>

  {#if imageNonSquare()}
    <AspectRatioAlert />
  {/if}

  <div class="flex gap-4">
    {#if imageNonSquare()}
      <ScaleModeToggleGroup bind:scaleMode />
    {/if}

    <TransformControls disabled={transformDisabled} bind:transform />
  </div>

  <Separator />

  <BackgroundColorSlider bind:backgroundColor />

  <Separator />

  <DitherControls bind:ditheringKernel />

  {#if ditheringKernel !== null}
    <ContrastSlider bind:contrast />
  {/if}

  {#if ditheringKernel === null || contrast !== 0}
    <BiasSlider bind:bias />
  {/if}

  <Separator />

  <Button variant="secondary" class="w-full" onclick={restoreDefaultImageSettings}>
    <IconEditOff />
    Reset All
  </Button>
</section>
