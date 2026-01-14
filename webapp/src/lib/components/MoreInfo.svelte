<script lang="ts">
import * as Popover from '$lib/components/ui/popover'
import type { PopoverTriggerProps } from 'bits-ui'
import type { Snippet } from 'svelte'
import IconInfo from '~icons/material-symbols/info'

interface Props extends PopoverTriggerProps {
  icon?: Snippet
}

const { icon, children, ...restProps }: Props = $props()
</script>

<Popover.Root>
  <Popover.Trigger aria-label="More info" {...restProps}>
    {#if !icon}
      <IconInfo class="text-sm text-muted-foreground" aria-hidden />
    {:else}
      {@render icon()}
    {/if}
  </Popover.Trigger>

  <Popover.Content class="text-sm">
    {#if children}
      {@render children()}
    {/if}
  </Popover.Content>
</Popover.Root>
