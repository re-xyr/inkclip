<script lang="ts">
  import { Label } from '$lib/components/ui/label'
  import { Slider } from '$lib/components/ui/slider'
  import Infotip from '$lib/components/Infotip.svelte'
  import { getConversionConfig } from '$lib/contexts/config.svelte'

  const config = getConversionConfig()
</script>

<div class="flex flex-col gap-4">
  <Label id="background-color-input-label" class="multimodal">
    Background Color
    <span class="font-normal text-muted-foreground"> = {config.backgroundColor} </span>
    <Infotip>The color used for transparent pixels.</Infotip>
  </Label>

  <Slider
    type="single"
    value={config.backgroundColor}
    onValueCommit={v => {
      config.backgroundColor = v
    }}
    min={0}
    max={255}
    step={1}
    aria-labelledby="background-color-input-label"
  />
</div>
