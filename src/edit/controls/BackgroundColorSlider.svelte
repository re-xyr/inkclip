<script lang="ts">
  import { Label } from '$lib/components/ui/label'
  import { Slider } from '$lib/components/ui/slider'
  import Infotip from '$lib/Infotip.svelte'

  interface Props {
    backgroundColor: number
  }

  let { backgroundColor = $bindable() }: Props = $props()
</script>

<div class="flex flex-col gap-4">
  <Label for="background-color-input" class="multimodal">
    <div>
      Background Color
      <span class="font-normal text-muted-foreground"> = {backgroundColor} </span>
    </div>
    <Infotip>The color used for transparent pixels.</Infotip>
  </Label>

  <Slider
    type="single"
    value={backgroundColor}
    onValueCommit={v => {
      backgroundColor = v
    }}
    min={0}
    max={255}
    step={1}
    id="background-color-input"
  />
</div>
