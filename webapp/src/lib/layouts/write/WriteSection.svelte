<script lang="ts">
import { Separator } from '$lib/components/ui/separator'
import { getDeviceContext } from '$lib/contexts/device.svelte'
import { getImageContext } from '$lib/contexts/image.svelte'
import { cn } from '$lib/utils'
import IconArrowUploadProgress from '~icons/material-symbols/arrow-upload-progress'
import IconPending from '~icons/material-symbols/pending'
import IconWarning from '~icons/material-symbols/warning'
import WriteButton from './WriteButton.svelte'

const deviceCtx = getDeviceContext()
const imageCtx = getImageContext()

let inProgress = $state(false)
</script>

<section aria-labelledby="write-section-label">
  <Separator decorative />

  <div class="mx-6 mt-4 mb-6 stack gap-2 md:row xl:mx-0">
    <div class="grow">
      <h2
        class={cn(
          'text-xl/8 font-semibold transition-all',
          (deviceCtx.device && imageCtx.image) || 'font-normal opacity-50',
        )}
        id="write-section-label"
      >
        Write pattern to device
      </h2>

      <div class="stack-h gap-1 text-sm" aria-live="polite">
        {#if imageCtx.image === null}
          <IconPending class="mt-0.5 shrink-0" aria-hidden /> Select an image file in order to write it
          onto your device.
        {:else if !inProgress}
          <IconArrowUploadProgress class="mt-0.5 shrink-0" aria-hidden /> Write the pattern onto your
          device if you have finished editing the image.
        {:else}
          <IconWarning class="mt-0.5 shrink-0" aria-hidden /> Refresh in progress. Do not disconnect device.
        {/if}
      </div>
    </div>

    <WriteButton onprogress={v => (inProgress = v)} />
  </div>
</section>

<style>
section {
  position: sticky;
  bottom: 0;
  background: var(--color-background);
}
</style>
