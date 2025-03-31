<script lang="ts">
  import { DEFAULT_DITHERING_KERNEL, type DitheringKernel } from '$lib/image/quantizer'
  import DitheringKernelDropdown from './DitheringKernelDropdown.svelte'
  import DitherSwitch from './DitherSwitch.svelte'

  interface Props {
    ditheringKernel: DitheringKernel | null
  }

  let { ditheringKernel = $bindable() }: Props = $props()
  let lastDitheringKernel: DitheringKernel = $state(ditheringKernel ?? DEFAULT_DITHERING_KERNEL)
</script>

<div class="flex gap-4">
  <DitherSwitch
    checked={ditheringKernel !== null}
    onCheckedChange={c => {
      if (c) {
        ditheringKernel = lastDitheringKernel
      } else {
        ditheringKernel = null
      }
    }}
  />

  <DitheringKernelDropdown
    class={ditheringKernel !== null ? [] : ['invisible']}
    value={ditheringKernel ?? DEFAULT_DITHERING_KERNEL}
    onchange={v => {
      ditheringKernel = lastDitheringKernel = v
    }}
  />
</div>
