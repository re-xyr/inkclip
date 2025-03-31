<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils'

  import { ditheringKernels, type DitheringKernel } from '$lib/image/quantizer'

  import { Label } from '$lib/components/ui/label'
  import * as Select from '$lib/components/ui/select'
  import Infotip from '$lib/Infotip.svelte'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    value: DitheringKernel
    onchange: (v: DitheringKernel) => void
  }

  let { value, onchange, class: classNames, ...restProps }: Props = $props()
</script>

<div class={cn('grow flex flex-col gap-2', classNames)} {...restProps}>
  <Label class="multimodal">
    <div>Dithering Kernel</div>

    <Infotip>
      Algorithm used for dithering. <br />
      Switch around to see which one works best for your image.
    </Infotip>
  </Label>

  <Select.Root type="single" {value} onValueChange={v => onchange(v as DitheringKernel)}>
    <Select.Trigger>{ditheringKernels[value]}</Select.Trigger>
    <Select.Content>
      {#each Object.entries(ditheringKernels) as [kernel, name]}
        <Select.Item value={kernel}>{name}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
</div>
