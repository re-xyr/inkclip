<script lang="ts">
import { getConversionConfig } from '$lib/contexts/config.svelte'
import { DEFAULT_DITHERING_KERNEL, type DitheringKernel } from '$lib/image/quantizer'
import DitherSwitch from './DitherSwitch.svelte'
import DitheringKernelDropdown from './DitheringKernelDropdown.svelte'

const config = getConversionConfig()

let lastDitheringKernel: DitheringKernel = $state(DEFAULT_DITHERING_KERNEL)

$effect(() => {
  if (config.ditheringKernel === null) return
  lastDitheringKernel = config.ditheringKernel
})
</script>

<div class="stack-h gap-4">
  <DitherSwitch
    checked={config.ditheringKernel !== null}
    onchange={c => (config.ditheringKernel = c ? lastDitheringKernel : null)}
  />

  <DitheringKernelDropdown
    hidden={config.ditheringKernel === null}
    value={lastDitheringKernel}
    onchange={v => {
      config.ditheringKernel = v
    }}
  />
</div>
