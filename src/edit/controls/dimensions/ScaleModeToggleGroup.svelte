<script lang="ts">
  import type { ScaleMode } from '$lib/image/scaler'

  import { Label } from '$lib/components/ui/label'
  import * as ToggleGroup from '$lib/components/ui/toggle-group'
  import * as Tooltip from '$lib/components/ui/tooltip'

  interface Props {
    scaleMode: ScaleMode
  }

  let { scaleMode = $bindable() }: Props = $props()
</script>

<div class="flex flex-col gap-2">
  <Label for="scale-mode-input">Scaling method</Label>
  <Tooltip.Provider delayDuration={0} disableHoverableContent>
    <ToggleGroup.Root
      id="scale-mode-input"
      type="single"
      bind:value={
        () => scaleMode,
        v => {
          if (v.length !== 0) scaleMode = v as ScaleMode
        }
      }
    >
      <Tooltip.Root>
        <Tooltip.Trigger>
          <ToggleGroup.Item value="fit">Fit</ToggleGroup.Item>
        </Tooltip.Trigger>
        <Tooltip.Content>
          Fit the entire image onto the display. <br />
          May introduce letterboxing.
        </Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>
          <ToggleGroup.Item value="crop">Crop</ToggleGroup.Item>
        </Tooltip.Trigger>
        <Tooltip.Content>Fill the display and crop out-of-frame parts of the image.</Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>
          <ToggleGroup.Item value="distort">Distort</ToggleGroup.Item>
        </Tooltip.Trigger>
        <Tooltip.Content>
          Stretch the image to fill the display. <br />
          Distorts the aspect ratio.
        </Tooltip.Content>
      </Tooltip.Root>
    </ToggleGroup.Root>
  </Tooltip.Provider>
</div>
