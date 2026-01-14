<script lang="ts">
import ImplicitNumericInput from '$lib/components/ImplicitNumericInput.svelte'
import MoreInfo from '$lib/components/MoreInfo.svelte'
import { Label } from '$lib/components/ui/label'
import { Slider } from '$lib/components/ui/slider'
import { getConversionConfig } from '$lib/contexts/config.svelte'

const config = getConversionConfig()

let value = $derived(Math.round(config.contrast * 100))
</script>

<div class="stack gap-4" role="group" aria-labelledby="contrast-input-label">
  <div class="row gap-1 text-sm">
    <Label id="contrast-input-label">Contrast</Label>
    <span class="font-normal text-muted-foreground">
      =<ImplicitNumericInput
        min={0}
        max={100}
        {value}
        onchange={v => (config.contrast = (value = v) / 100)}
        aria-labelledby="contrast-input-label"
      />%
    </span>
    <MoreInfo>
      How eager the conversion algorithm should push colors towards the two ends (black and white)
      of the grayscale.
    </MoreInfo>
  </div>

  <Slider
    type="single"
    bind:value
    onValueCommit={() => (config.contrast = value / 100)}
    min={0}
    max={100}
    step={1}
    aria-labelledby="contrast-input-label"
  />
</div>
