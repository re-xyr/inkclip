<script lang="ts">
import * as AlertDialog from '$lib/components/ui/alert-dialog'
import { getMidiContext } from '$lib/contexts/midi.svelte'

interface Props {
  open: boolean
}

let { open }: Props = $props()

const midiCtx = getMidiContext()
</script>

<AlertDialog.Root {open}>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content escapeKeydownBehavior="ignore">
      <AlertDialog.Title>MIDI permission needed</AlertDialog.Title>

      <AlertDialog.Description class="stack gap-2">
        <p>Write to Inkclip uses the Web MIDI API to talk to your device.</p>
        <p>
          Click on "I understand", and then follow your browser's prompt to grant us permission.
        </p>
      </AlertDialog.Description>

      <AlertDialog.Footer>
        <AlertDialog.Action onclick={() => midiCtx.acquire()}>I understand</AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
