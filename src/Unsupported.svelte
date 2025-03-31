<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog'
</script>

<AlertDialog.Root open>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Browser not supported</AlertDialog.Title>

      <AlertDialog.Description>
        <p class="mb-4">Write to Inkclip uses the WebHID API, which is not supported by your browser.</p>
        <p>
          We recommend using a Chromium-based browser, such as a recent version of Google Chrome, Microsoft Edge, Opera,
          or Arc.
        </p>
      </AlertDialog.Description>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
