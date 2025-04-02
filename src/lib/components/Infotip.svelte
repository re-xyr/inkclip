<script lang="ts">
  import IconInfo from '~icons/material-symbols/info'

  import * as Popover from '$lib/components/ui/popover'
  import { Label } from '$lib/components/ui/label'
</script>

<Popover.Root>
  <Label>
    <Popover.Trigger>
      <IconInfo class="text-muted-foreground inline" />
    </Popover.Trigger>
  </Label>

  <Popover.Content class="text-sm">
    <slot />
  </Popover.Content>
</Popover.Root>
