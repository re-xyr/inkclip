<script lang="ts">
import ImplicitNumericInput from '$lib/components/ImplicitNumericInput.svelte'
import MoreInfo from '$lib/components/MoreInfo.svelte'
import { Label } from '$lib/components/ui/label'
import { Slider } from '$lib/components/ui/slider'
import { getConversionConfig } from '$lib/contexts/config.svelte'

const config = getConversionConfig()

let value = $derived(Math.round(config.brightness * 100))
</script>

<div class="stack gap-4" role="group" aria-labelledby="brightness-input-label">
  <div class="row gap-1 text-sm">
    <Label id="brightness-input-label">Brightness</Label>
    <span class="font-normal text-muted-foreground">
      =<ImplicitNumericInput
        min={-100}
        max={100}
        {value}
        onchange={v => (config.brightness = (value = v) / 100)}
        aria-labelledby="brightness-input-label"
      />%
    </span>
    <MoreInfo>
      Whether the conversion algorithm should bias the entire image towards white (positive) or
      black (negative).
    </MoreInfo>
  </div>

  <Slider
    type="single"
    bind:value
    onValueCommit={() => (config.brightness = value / 100)}
    min={-100}
    max={100}
    step={1}
    aria-labelledby="brightness-input-label"
  />
</div>
