<script lang="ts">
import { Button } from '$lib/components/ui/button'
import { Label } from '$lib/components/ui/label'
import * as Tooltip from '$lib/components/ui/tooltip'
import { getConversionConfig } from '$lib/contexts/config.svelte'
import type { Operation } from '$lib/image/transform'
import IconRotate90DegreesCcw from '~icons/material-symbols/rotate-90-degrees-ccw'
import IconRotate90DegreesCw from '~icons/material-symbols/rotate-90-degrees-cw'
import IconFlipVertical from '~icons/mdi/flip-Vertical'
import IconFlipHorizontal from '~icons/mdi/flip-horizontal'

interface Props {
  disabled?: boolean
}

const { disabled = false }: Props = $props()

const config = getConversionConfig()

const operations = {
  cw: {
    icon: IconRotate90DegreesCw,
    description: 'Rotate 90° clockwise',
  },
  ccw: {
    icon: IconRotate90DegreesCcw,
    description: 'Rotate 90° counter-clockwise',
  },
  h: {
    icon: IconFlipHorizontal,
    description: 'Flip horizontally',
  },
  v: {
    icon: IconFlipVertical,
    description: 'Flip vertically',
  },
}
</script>

<div class="stack gap-2">
  <Label id="transform-controls-label">Transform</Label>

  <div role="group" aria-labelledby="transform-controls-label">
    <Tooltip.Provider delayDuration={0} disableHoverableContent>
      {#each Object.entries(operations) as [op, { icon: Icon, description }]}
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <Button
                {...props}
                {disabled}
                size="icon"
                variant="outline"
                onclick={() => {
                  config.transform = config.transform.op(op as Operation)
                }}
              >
                <Icon aria-label={description} />
              </Button>
            {/snippet}
          </Tooltip.Trigger>

          <Tooltip.Content>{description}</Tooltip.Content>
        </Tooltip.Root>
      {/each}
    </Tooltip.Provider>
  </div>
</div>
