<script lang="ts">
  import { Label } from '$lib/components/ui/label'
  import { Slider } from '$lib/components/ui/slider'
  import Infotip from '$lib/Infotip.svelte'

  interface Props {
    contrast: number
  }

  let { contrast = $bindable() }: Props = $props()
</script>

<div class="flex flex-col gap-4">
  <Label for="contrast-input" class="multimodal">
    <div>
      Contrast
      <span class="font-normal text-muted-foreground"> = {Math.floor(contrast * 100)}% </span>
    </div>

    <Infotip>
      How eager the conversion algorithm should push colors towards the two ends (black and white) of the grayscale.
    </Infotip>
  </Label>

  <Slider
    type="single"
    value={contrast}
    onValueCommit={v => {
      contrast = v
    }}
    min={0}
    max={1}
    step={0.01}
    id="contrast-input"
  />
</div>
