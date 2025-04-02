<script lang="ts">
  import { Switch } from '$lib/components/ui/switch'
  import { Label } from '$lib/components/ui/label'
  import Infotip from '$lib/components/Infotip.svelte'

  interface Props {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
  }

  let { checked, onCheckedChange }: Props = $props()
</script>

<div class="flex flex-col gap-2">
  <div>
    <Label for="dither-switch" class="multimodal">
      <div>Dither</div>
      <Infotip>Dithering uses different dot densities to simulate shades of gray.</Infotip>
    </Label>
  </div>

  <div class="grow flex items-center">
    <Switch id="dither-switch" {checked} {onCheckedChange} />
  </div>
</div>
