<script lang="ts">
  import IconDisabledByDefault from '~icons/material-symbols/disabled-by-default'

  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils'

  import * as AlertDialog from '$lib/components/ui/alert-dialog'

  interface Props extends HTMLAttributes<HTMLElement> {}

  const { class: classNames, ...restProps }: Props = $props()
</script>

<main
  class={cn('flex items-center justify-center gap-2 font-medium text-xl text-muted-foreground', classNames)}
  {...restProps}
>
  <IconDisabledByDefault />
  <div>Not Supported</div>
</main>

<AlertDialog.Root open>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Browser not supported</AlertDialog.Title>

      <AlertDialog.Description>
        <p class="mb-2">Write to Inkclip uses the WebHID API, which is not supported by your browser.</p>
        <p>
          We recommend using a Chromium-based browser, such as a recent version of Google Chrome, Microsoft Edge, Opera,
          or Arc.
        </p>
      </AlertDialog.Description>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
