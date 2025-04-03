<script lang="ts">
  import IconPending from '~icons/material-symbols/pending'
  import IconCheckCircle from '~icons/material-symbols/check-circle'
  import ConnectButton from './ConnectButton.svelte'

  import { getDeviceContext } from '$lib/contexts/device.svelte'

  const deviceCtx = getDeviceContext()
</script>

<section class="row gap-2 max-lg:stack max-lg:items-stretch" aria-labelledby="connect-section-label">
  <div class="grow">
    <h2 class="font-semibold text-xl/8" id="connect-section-label">Connect to a device</h2>

    <div class="row gap-1 text-sm" aria-live="polite">
      {#if deviceCtx.device === null}
        <IconPending aria-hidden /> Not connected to any device yet. Plug in your device, and click on the button to select
        it.
      {:else}
        <IconCheckCircle aria-hidden /> Successfully conected to device. If you want to, you can connect to another device
        instead.
      {/if}
    </div>
  </div>

  <ConnectButton />
</section>
