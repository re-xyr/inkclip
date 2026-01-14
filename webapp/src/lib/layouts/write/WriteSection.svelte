<script lang="ts">
import { getImageContext } from '$lib/contexts/image.svelte'
import IconArrowUploadProgress from '~icons/material-symbols/arrow-upload-progress'
import IconPending from '~icons/material-symbols/pending'
import IconWarning from '~icons/material-symbols/warning'
import WriteButton from './WriteButton.svelte'

const imageCtx = getImageContext()

let inProgress = $state(false)
</script>

<section class="flex flex-col gap-2 lg:flex-row" aria-labelledby="write-section-label">
  <div class="grow">
    <h2 class="text-xl/8 font-semibold" id="write-section-label">Write pattern to device</h2>

    <div class="stack-h gap-1 text-sm" aria-live="polite">
      {#if imageCtx.image === null}
        <IconPending class="mt-0.5 shrink-0" aria-hidden /> Select an image file in order to write it
        onto your device.
      {:else if !inProgress}
        <IconArrowUploadProgress class="mt-0.5 shrink-0" aria-hidden /> Write the pattern onto your device
        if you have finished editing the image.
      {:else}
        <IconWarning class="mt-0.5 shrink-0" aria-hidden /> Refresh in progress. Do not disconnect device.
      {/if}
    </div>
  </div>

  <WriteButton onprogress={v => (inProgress = v)} />
</section>
