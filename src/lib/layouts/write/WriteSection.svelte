<script lang="ts">
  import IconHelp from '~icons/material-symbols/help'
  import IconPending from '~icons/material-symbols/pending'
  import IconArrowUploadProgress from '~icons/material-symbols/arrow-upload-progress'
  import IconWarning from '~icons/material-symbols/warning'

  import WriteButton from './WriteButton.svelte'
  import { getDeviceContext } from '$lib/contexts/device.svelte'
  import { getBitmapContext } from '$lib/contexts/bitmap.svelte'

  const deviceCtx = getDeviceContext()
  const bitmapCtx = getBitmapContext()

  let inProgress = $state(false)
</script>

<section class="flex items-center gap-2 max-lg:flex-col max-lg:items-stretch">
  <div class="grow">
    <h1 class="font-semibold text-xl/8">Write pattern to device</h1>

    <div class="text-sm">
      {#if deviceCtx.device === null}
        <IconHelp class="inline" /> To start writing patterns to your device, connect it first.
      {:else if bitmapCtx.image === null}
        <IconPending class="inline" /> Select an image file in order to write it onto your device.
      {:else if !inProgress}
        <IconArrowUploadProgress class="inline" /> Write the pattern onto your device if you have finished editing the image.
      {:else}
        <IconWarning class="inline" /> Refresh in progress. Do not disconnect device.
      {/if}
    </div>
  </div>

  <WriteButton
    onprogress={v => {
      inProgress = v
    }}
  />
</section>
