<script lang="ts">
  import { Label } from '$lib/components/ui/label'
  import { Slider } from '$lib/components/ui/slider'
  import Infotip from '$lib/components/Infotip.svelte'
  import { getConversionConfig } from '$lib/contexts/config.svelte'

  const config = getConversionConfig()
</script>

<div class="flex flex-col gap-4">
  <Label for="bias-input" class="multimodal">
    <div>
      Bias
      <span class="font-normal text-muted-foreground"> = {Math.floor(config.bias * 100)}% </span>
    </div>

    <Infotip>
      How eager the conversion algorithm should push colors towards the two ends (black and white) of the grayscale.
    </Infotip>
  </Label>

  <Slider
    type="single"
    value={config.bias}
    onValueCommit={v => {
      config.bias = v
    }}
    min={-1}
    max={1}
    step={0.01}
    id="bias-input"
  />
</div>
