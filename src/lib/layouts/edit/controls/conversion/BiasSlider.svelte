<script lang="ts">
  import { Label } from '$lib/components/ui/label'
  import { Slider } from '$lib/components/ui/slider'
  import MoreInfo from '$lib/components/MoreInfo.svelte'

  import { getConversionConfig } from '$lib/contexts/config.svelte'

  const config = getConversionConfig()

  let value = $derived(Math.round(config.bias * 100))
</script>

<div class="stack gap-4" role="group" aria-label="Bias">
  <div class="row gap-1 text-sm">
    <Label id="bias-input-label">Bias</Label>
    <span class="font-normal text-muted-foreground"> = {value}% </span>
    <MoreInfo>
      Whether the conversion algorithm should bias the entire image towards white (negative) or black (positive).
    </MoreInfo>
  </div>

  <Slider
    type="single"
    bind:value
    onValueCommit={() => (config.bias = value / 100)}
    min={-100}
    max={100}
    step={1}
    aria-labelledby="bias-input-label"
  />
</div>
