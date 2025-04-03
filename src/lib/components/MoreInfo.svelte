<script lang="ts">
  import type { PopoverTriggerProps } from 'bits-ui'

  import IconInfo from '~icons/material-symbols/info'
  import * as Popover from '$lib/components/ui/popover'

  interface Props extends PopoverTriggerProps {}

  const { children, ...restProps }: Props = $props()
</script>

<Popover.Root>
  <Popover.Trigger aria-label="More info" {...restProps}>
    <IconInfo class="text-muted-foreground text-sm" aria-hidden />
  </Popover.Trigger>

  <Popover.Content class="text-sm">
    {#if children}
      {@render children()}
    {/if}
  </Popover.Content>
</Popover.Root>
