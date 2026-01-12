<script lang="ts">
import { type DitheringKernel } from '$lib/image/quantizer'

import { Label } from '$lib/components/ui/label'
import * as Select from '$lib/components/ui/select'
import MoreInfo from '$lib/components/MoreInfo.svelte'

import { cn } from '$lib/utils'

interface Props {
  hidden: boolean
  value: DitheringKernel
  onchange: (v: DitheringKernel) => void
}

const { hidden, value, onchange }: Props = $props()

const ditheringKernels: Record<DitheringKernel, string> = {
  FloydSteinberg: 'Floyd-Steinberg',
  FalseFloydSteinberg: 'False Floyd-Steinberg',
  Stucki: 'Stucki',
  Atkinson: 'Atkinson',
  Jarvis: 'Jarvis',
  Burkes: 'Burkes',
  Sierra: 'Sierra',
  TwoSierra: '2-Row Sierra',
  SierraLite: 'Sierra Lite',
}
</script>

<div
  class={cn('grow stack gap-2', hidden ? ['invisible'] : [])}
  role="group"
  aria-labelledby="dithering-kernel-select-label"
>
  <div class="row gap-1">
    <Label id="dithering-kernel-select-label">Dithering Kernel</Label>

    <MoreInfo>
      Algorithm used for dithering. <br />
      Switch around to see which one works best for your image.
    </MoreInfo>
  </div>

  <Select.Root type="single" {value} onValueChange={v => onchange(v as DitheringKernel)}>
    <Select.Trigger class="w-full" aria-labelledby="dithering-kernel-select-label">
      {ditheringKernels[value]}
    </Select.Trigger>
    <Select.Content>
      {#each Object.entries(ditheringKernels) as [kernel, name]}
        <Select.Item value={kernel}>{name}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
</div>
