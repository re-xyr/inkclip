<script lang="ts">
import * as AlertDialog from '$lib/components/ui/alert-dialog'

interface Props {
  open: boolean
}

let { open }: Props = $props()
</script>

<AlertDialog.Root {open}>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content escapeKeydownBehavior="ignore">
      <AlertDialog.Title>MIDI permission needed</AlertDialog.Title>

      <AlertDialog.Description class="stack gap-2">
        <p>
          We detected that we are denied MIDI access. This means this tool cannot function properly.
        </p>
        <p>
          To use this tool, you will need to grant us MIDI permission manually in your browser
          settings, and then reload this page.
        </p>
      </AlertDialog.Description>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
