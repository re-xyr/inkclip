<script lang="ts">
  import { DEFAULT_DITHERING_KERNEL, type DitheringKernel } from '$lib/image/quantizer'
  import { getConversionConfig } from '$lib/contexts/config.svelte'
  import DitheringKernelDropdown from './DitheringKernelDropdown.svelte'
  import DitherSwitch from './DitherSwitch.svelte'

  const config = getConversionConfig()

  let lastDitheringKernel: DitheringKernel = $state(DEFAULT_DITHERING_KERNEL)

  $effect(() => {
    if (config.ditheringKernel === null) return
    lastDitheringKernel = config.ditheringKernel
  })
</script>

<div class="flex gap-4">
  <DitherSwitch
    checked={config.ditheringKernel !== null}
    onCheckedChange={c => {
      if (c) {
        config.ditheringKernel = lastDitheringKernel
      } else {
        config.ditheringKernel = null
      }
    }}
  />

  <DitheringKernelDropdown
    class={config.ditheringKernel !== null ? [] : ['invisible']}
    value={lastDitheringKernel}
    onchange={v => {
      config.ditheringKernel = v
    }}
  />
</div>
