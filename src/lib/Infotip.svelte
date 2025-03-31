<script lang="ts">
  import IconInfo from '~icons/material-symbols/info'

  import * as Popover from '$lib/components/ui/popover'
</script>

<Popover.Root>
  <Popover.Trigger>
    <IconInfo class="text-muted-foreground text-sm" />
  </Popover.Trigger>

  <Popover.Content class="text-sm">
    <slot />
  </Popover.Content>
</Popover.Root>
