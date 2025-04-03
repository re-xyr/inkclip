<script lang="ts">
  import { Switch } from '$lib/components/ui/switch'
  import { Label } from '$lib/components/ui/label'
  import MoreInfo from '$lib/components/MoreInfo.svelte'

  interface Props {
    checked: boolean
    onchange: (checked: boolean) => void
  }

  let { checked, onchange }: Props = $props()
</script>

<div class="stack gap-2" role="group" aria-label="Dither">
  <div class="row gap-1">
    <Label id="dither-switch-label">Dither</Label>
    <MoreInfo>Dithering uses different dot densities to simulate shades of gray.</MoreInfo>
  </div>

  <div class="grow row items-center">
    <Switch {checked} onCheckedChange={onchange} aria-labelledby="dither-switch-label" />
  </div>
</div>
