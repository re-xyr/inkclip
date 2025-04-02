<script lang="ts">
  import IconPending from '~icons/material-symbols/pending'
  import IconCheckCircle from '~icons/material-symbols/check-circle'

  import ConnectButton from './ConnectButton.svelte'
  import { getDeviceContext } from '$lib/contexts/device.svelte'

  const deviceCtx = getDeviceContext()
</script>

<section class="flex items-center gap-2 max-lg:flex-col max-lg:items-stretch">
  <div class="grow">
    <h1 class="font-semibold text-xl/8">Connect to a device</h1>

    <div class="text-sm">
      {#if deviceCtx.device === null}
        <IconPending class="inline" /> Not connected to any device yet. Plug in your device, and click on the button to select
        it.
      {:else}
        <IconCheckCircle class="inline" /> Successfully conected to device. If you want to, you can connect to another device
        instead.
      {/if}
    </div>
  </div>

  <ConnectButton />
</section>
