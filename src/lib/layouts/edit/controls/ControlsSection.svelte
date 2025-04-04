<script lang="ts">
  import { Transform } from '$lib/image/transform'

  import { Button } from '$lib/components/ui/button'
  import Separator from '$lib/components/ui/separator/separator.svelte'
  import IconEditOff from '~icons/material-symbols/edit-off'
  import AspectRatioAlert from './dimensions/AspectRatioAlert.svelte'
  import ScaleModeToggleGroup from './dimensions/ScaleModeToggleGroup.svelte'
  import TransformControls from './dimensions/TransformControls.svelte'
  import BackgroundColorSlider from './BackgroundColorSlider.svelte'
  import DitherControls from './conversion/dither/DitherControls.svelte'
  import ContrastSlider from './conversion/ContrastSlider.svelte'
  import BiasSlider from './conversion/BiasSlider.svelte'

  import { getConversionConfig } from '$lib/contexts/config.svelte'
  import { getImageContext, imageIsCorrectRatio } from '$lib/contexts/image.svelte'
  import { DEFAULT_DITHERING_KERNEL } from '$lib/image/quantizer'

  const imageCtx = getImageContext()
  const config = getConversionConfig()

  const transformDisabled = $derived(imageCtx.image === null)
  const imageNonSquare = $derived(!imageIsCorrectRatio(imageCtx))

  function restoreDefaultImageSettings() {
    config.scaleMode = 'fit'
    config.transform = new Transform()
    config.backgroundColor = 0xff
    config.ditheringKernel = DEFAULT_DITHERING_KERNEL
    config.contrast = 0
    config.bias = 0
  }
</script>

<section class="grow stack gap-4" aria-labelledby="controls-section-label">
  <h2 class="font-semibold text-xl/6" id="controls-section-label">Edit image</h2>

  {#if imageNonSquare}
    <AspectRatioAlert />
  {/if}

  <div class="row gap-4">
    {#if imageNonSquare}
      <ScaleModeToggleGroup />
    {/if}

    <TransformControls disabled={transformDisabled} />
  </div>

  <Separator decorative />

  <BackgroundColorSlider />

  <Separator decorative />

  <DitherControls />

  {#if config.ditheringKernel !== null}
    <ContrastSlider />
  {/if}

  {#if config.ditheringKernel === null || config.contrast !== 0}
    <BiasSlider />
  {/if}

  <Separator decorative />

  <Button variant="secondary" class="w-full" onclick={restoreDefaultImageSettings}>
    <IconEditOff aria-hidden />
    Reset All
  </Button>
</section>
