<script lang="ts">
  import IconPending from '~icons/material-symbols/pending'
  import IconArrowUploadProgress from '~icons/material-symbols/arrow-upload-progress'
  import IconWarning from '~icons/material-symbols/warning'
  import WriteButton from './WriteButton.svelte'

  import { getImageContext } from '$lib/contexts/image.svelte'

  const imageCtx = getImageContext()

  let inProgress = $state(false)
</script>

<section class="row gap-2 max-lg:stack max-lg:items-stretch" aria-labelledby="write-section-label">
  <div class="grow">
    <h2 class="font-semibold text-xl/8" id="write-section-label">Write pattern to device</h2>

    <div class="row gap-1 text-sm" aria-live="polite">
      {#if imageCtx.image === null}
        <IconPending aria-hidden /> Select an image file in order to write it onto your device.
      {:else if !inProgress}
        <IconArrowUploadProgress aria-hidden /> Write the pattern onto your device if you have finished editing the image.
      {:else}
        <IconWarning aria-hidden /> Refresh in progress. Do not disconnect device.
      {/if}
    </div>
  </div>

  <WriteButton onprogress={v => (inProgress = v)} />
</section>
