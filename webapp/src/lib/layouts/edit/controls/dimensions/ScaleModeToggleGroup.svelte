<script lang="ts">
import type { ScaleMode } from '$lib/image/scaler'

import { Label } from '$lib/components/ui/label'
import * as ToggleGroup from '$lib/components/ui/toggle-group'
import * as Tooltip from '$lib/components/ui/tooltip'

import { getConversionConfig } from '$lib/contexts/config.svelte'

const config = getConversionConfig()

const scaleModes: Record<ScaleMode, { name: string; description: string }> = {
  fit: {
    name: 'Fit',
    description: 'Fit the entire image onto the display. May introduce letterboxing.',
  },
  crop: {
    name: 'Crop',
    description: 'Fill the display and crop out-of-frame parts of the image.',
  },
  distort: {
    name: 'Distort',
    description: 'Stretch the image to fill the display. Distorts the aspect ratio.',
  },
}
</script>

<div class="stack gap-2">
  <Label id="scale-mode-input-label">Scaling method</Label>

  <ToggleGroup.Root
    type="single"
    spacing={1}
    bind:value={
      () => config.scaleMode,
      v => {
        if (v.length !== 0) config.scaleMode = v as ScaleMode
      }
    }
    aria-labelledby="scale-mode-input-label"
  >
    <Tooltip.Provider delayDuration={0} disableHoverableContent>
      {#each Object.entries(scaleModes) as [mode, { name, description }]}
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <ToggleGroup.Item {...props} value={mode}>{name}</ToggleGroup.Item>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content>
            {description}
          </Tooltip.Content>
        </Tooltip.Root>
      {/each}
    </Tooltip.Provider>
  </ToggleGroup.Root>
</div>
