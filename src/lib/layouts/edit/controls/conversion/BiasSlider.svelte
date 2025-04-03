<script lang="ts">
  import { Label } from '$lib/components/ui/label'
  import { Slider } from '$lib/components/ui/slider'
  import MoreInfo from '$lib/components/MoreInfo.svelte'

  import { getConversionConfig } from '$lib/contexts/config.svelte'

  const config = getConversionConfig()

  let value = $derived(config.bias)
</script>

<div class="stack gap-4" role="group" aria-label="Bias">
  <div class="row gap-1 text-sm">
    <Label id="bias-input-label">Bias</Label>
    <span class="font-normal text-muted-foreground"> = {Math.floor(value * 100)}% </span>
    <MoreInfo>
      Whether the conversion algorithm should bias the entire image towards white (negative) or black (positive).
    </MoreInfo>
  </div>

  <Slider
    type="single"
    bind:value
    onValueCommit={() => (config.bias = value)}
    min={-1}
    max={1}
    step={0.01}
    aria-labelledby="bias-input-label"
  />
</div>
