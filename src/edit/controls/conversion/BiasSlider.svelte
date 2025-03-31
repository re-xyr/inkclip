<script lang="ts">
  import { Label } from '$lib/components/ui/label'
  import { Slider } from '$lib/components/ui/slider'
  import Infotip from '$lib/Infotip.svelte'

  interface Props {
    bias: number
  }

  let { bias = $bindable() }: Props = $props()
</script>

<div class="flex flex-col gap-4">
  <Label for="bias-input" class="multimodal">
    <div>
      Bias
      <span class="font-normal text-muted-foreground"> = {Math.floor(bias * 100)}% </span>
    </div>

    <Infotip>
      How eager the conversion algorithm should push colors towards the two ends (black and white) of the grayscale.
    </Infotip>
  </Label>

  <Slider
    type="single"
    value={bias}
    onValueCommit={v => {
      bias = v
    }}
    min={-1}
    max={1}
    step={0.01}
    id="bias-input"
  />
</div>
