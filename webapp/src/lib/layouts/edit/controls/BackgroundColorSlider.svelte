<script lang="ts">
import ImplicitNumericInput from '$lib/components/ImplicitNumericInput.svelte'
import MoreInfo from '$lib/components/MoreInfo.svelte'
import { Label } from '$lib/components/ui/label'
import { Slider } from '$lib/components/ui/slider'
import { getConversionConfig } from '$lib/contexts/config.svelte'

const config = getConversionConfig()

let value = $derived(config.backgroundColor)
</script>

<div class="stack gap-4" role="group" aria-labelledby="background-color-input-label">
  <div class="row gap-1 text-sm">
    <Label id="background-color-input-label">Background Color</Label>
    <span class="font-normal text-muted-foreground">
      =<ImplicitNumericInput
        min={0}
        max={0xff}
        {value}
        onchange={v => (config.brightness = value = v)}
        aria-labelledby="background-color-input-label"
      />
    </span>
    <MoreInfo>The color used for transparent pixels.</MoreInfo>
  </div>

  <Slider
    type="single"
    bind:value
    onValueCommit={() => (config.backgroundColor = value)}
    min={0}
    max={0xff}
    step={1}
    aria-labelledby="background-color-input-label"
  />
</div>
