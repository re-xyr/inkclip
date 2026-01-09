<script lang="ts">
  import IconDisabledByDefault from '~icons/material-symbols/disabled-by-default'

  import * as AlertDialog from '$lib/components/ui/alert-dialog'
</script>

<main class="grow row justify-center gap-2 font-medium text-xl text-muted-foreground">
  <IconDisabledByDefault />
  <div>Not Supported</div>
</main>

<AlertDialog.Root open>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Browser not supported</AlertDialog.Title>

      <AlertDialog.Description class="stack gap-2">
        <p>Write to Inkclip uses the Web MIDI API, which is not supported by your browser.</p>
        <p>
          We recommend using a Chromium-based browser, such as a recent version of
          <a href="https://www.google.com/chrome/">Google Chrome</a>,
          <a href="https://www.microsoft.com/edge">Microsoft Edge</a>, or
          <a href="https://www.opera.com/">Opera</a>. Firefox may also work, although we are aware of more issues there.
        </p>
      </AlertDialog.Description>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
