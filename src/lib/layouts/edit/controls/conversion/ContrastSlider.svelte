<script lang="ts">
  import { Label } from '$lib/components/ui/label'
  import { Slider } from '$lib/components/ui/slider'
  import MoreInfo from '$lib/components/MoreInfo.svelte'

  import { getConversionConfig } from '$lib/contexts/config.svelte'

  const config = getConversionConfig()

  let value = $derived(config.contrast)
</script>

<div class="stack gap-4" role="group" aria-label="Contrast">
  <div class="row gap-1 text-sm">
    <Label id="contrast-input-label">Contrast</Label>
    <span class="font-normal text-muted-foreground"> = {Math.floor(value * 100)}% </span>
    <MoreInfo>
      How eager the conversion algorithm should push colors towards the two ends (black and white) of the grayscale.
    </MoreInfo>
  </div>

  <Slider
    type="single"
    bind:value
    onValueCommit={() => (config.contrast = value)}
    min={0}
    max={1}
    step={0.01}
    aria-labelledby="contrast-input-label"
  />
</div>
