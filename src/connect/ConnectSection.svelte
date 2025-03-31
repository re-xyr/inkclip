<script lang="ts">
  import IconPending from '~icons/material-symbols/pending'
  import IconCheckCircle from '~icons/material-symbols/check-circle'

  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import ConnectButton from './ConnectButton.svelte'

  interface Props {
    device: HIDDevice | null
    onchange: (device: HIDDevice | null) => void
  }

  const { device, onchange }: Props = $props()

  const hid = navigator.hid

  function isInkclip(dev: HIDDevice) {
    return dev.vendorId == 0xc0de && dev.productId == 0xcafe
  }

  async function tryGetPairedDevice() {
    const dev = (await hid.getDevices()).find(isInkclip)
    if (dev !== undefined) onchange(dev)
  }

  hid.addEventListener('connect', e => {
    if (isInkclip(e.device) && device === null) {
      toast.info('Device connected')
      onchange(e.device)
    }
  })

  hid.addEventListener('disconnect', e => {
    if (device === e.device) {
      toast.info('Device disconnected')
      onchange(null)
    }
  })

  onMount(() => {
    tryGetPairedDevice()
  })
</script>

<section class="flex items-center gap-2 max-lg:flex-col max-lg:items-stretch">
  <div class="grow">
    <h1 class="font-semibold text-xl/8">Connect to a device</h1>

    <div class="text-sm">
      {#if device === null}
        <IconPending class="inline" /> Not connected to any device yet. Plug in your device, and click on the button to select
        it.
      {:else}
        <IconCheckCircle class="inline" /> Successfully conected to device. If you want to, you can connect to another device
        instead.
      {/if}
    </div>
  </div>

  <ConnectButton onconnect={onchange} {device} />
</section>
