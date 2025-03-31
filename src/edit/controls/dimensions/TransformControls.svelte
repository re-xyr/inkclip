<script lang="ts">
  import IconRotate90DegreesCw from '~icons/material-symbols/rotate-90-degrees-cw'
  import IconRotate90DegreesCcw from '~icons/material-symbols/rotate-90-degrees-ccw'
  import IconFlipHorizontal from '~icons/mdi/flip-horizontal'
  import IconFlipVertical from '~icons/mdi/flip-Vertical'

  import { Transform } from '$lib/image/transform'

  import { Button } from '$lib/components/ui/button'
  import { Label } from '$lib/components/ui/label'
  import * as Tooltip from '$lib/components/ui/tooltip'

  interface Props {
    transform: Transform
    disabled?: boolean
  }

  let { transform = $bindable(), disabled = false }: Props = $props()
</script>

<div class="flex flex-col gap-2">
  <Label for="transform-controls">Transform</Label>

  <div id="transform-controls">
    <Tooltip.Provider delayDuration={0} disableHoverableContent>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button
            {disabled}
            size="icon"
            variant="outline"
            onclick={() => {
              transform = transform.cw()
            }}
          >
            <IconRotate90DegreesCw />
          </Button>
        </Tooltip.Trigger>

        <Tooltip.Content>Rotate 90&deg; clockwise</Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button
            {disabled}
            size="icon"
            variant="outline"
            onclick={() => {
              transform = transform.ccw()
            }}
          >
            <IconRotate90DegreesCcw />
          </Button>
        </Tooltip.Trigger>

        <Tooltip.Content>Rotate 90&deg; counter-clockwise</Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button
            {disabled}
            size="icon"
            variant="outline"
            onclick={() => {
              transform = transform.h()
            }}
          >
            <IconFlipHorizontal />
          </Button>
        </Tooltip.Trigger>

        <Tooltip.Content>Flip horizontally</Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button
            {disabled}
            size="icon"
            variant="outline"
            onclick={() => {
              transform = transform.v()
            }}
          >
            <IconFlipVertical />
          </Button>
        </Tooltip.Trigger>

        <Tooltip.Content>Flip vertically</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  </div>
</div>
