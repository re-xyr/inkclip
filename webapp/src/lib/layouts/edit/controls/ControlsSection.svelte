<script lang="ts">
import { Button } from '$lib/components/ui/button'
import Separator from '$lib/components/ui/separator/separator.svelte'
import { getConversionConfig } from '$lib/contexts/config.svelte'
import { getImageContext, imageIsCorrectRatio } from '$lib/contexts/image.svelte'
import { DEFAULT_DITHERING_KERNEL } from '$lib/image/quantizer'
import { Transform } from '$lib/image/transform'
import IconEditOff from '~icons/material-symbols/edit-off'
import BackgroundColorSlider from './BackgroundColorSlider.svelte'
import BrightnessSlider from './conversion/BrightnessSlider.svelte'
import ContrastSlider from './conversion/ContrastSlider.svelte'
import DitherControls from './conversion/dither/DitherControls.svelte'
import AspectRatioAlert from './dimensions/AspectRatioAlert.svelte'
import ScaleModeToggleGroup from './dimensions/ScaleModeToggleGroup.svelte'
import TransformControls from './dimensions/TransformControls.svelte'

const imageCtx = getImageContext()
const config = getConversionConfig()

const transformDisabled = $derived(imageCtx.image === null)
const imageNonSquare = $derived(!imageIsCorrectRatio(imageCtx.image))

function restoreDefaultImageSettings() {
  config.scaleMode = 'fit'
  config.transform = new Transform()
  config.backgroundColor = 0xff
  config.ditheringKernel = DEFAULT_DITHERING_KERNEL
  config.contrast = 0
  config.brightness = 0
}
</script>

<section class="stack grow gap-4" aria-labelledby="controls-section-label">
  <h2 class="text-xl/6 font-semibold" id="controls-section-label">Edit image</h2>

  {#if imageNonSquare}
    <AspectRatioAlert />
  {/if}

  <div class="stack gap-4 2xs:row">
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
    <BrightnessSlider />
  {/if}

  <Separator decorative />

  <Button variant="secondary" class="w-full" onclick={restoreDefaultImageSettings}>
    <IconEditOff aria-hidden />
    Reset All
  </Button>
</section>
