<script lang="ts">
  import IconInfo from '~icons/material-symbols/info'

  import * as Popover from '$lib/components/ui/popover'
</script>

<Popover.Root>
  <Popover.Trigger aria-label="More info">
    <IconInfo class="text-muted-foreground text-sm" aria-hidden />
  </Popover.Trigger>

  <Popover.Content class="text-sm">
    <slot />
  </Popover.Content>
</Popover.Root>
