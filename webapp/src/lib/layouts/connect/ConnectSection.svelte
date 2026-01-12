<script lang="ts">
import IconPending from '~icons/material-symbols/pending'
import IconCheckCircle from '~icons/material-symbols/check-circle'
import ConnectButton from './ConnectButton.svelte'

import { getDeviceContext } from '$lib/contexts/device.svelte'
import MoreInfo from '$lib/components/MoreInfo.svelte'
import { assert } from '$lib/utils'

const deviceCtx = getDeviceContext()

let serial = $state('[Retrieving...]')

async function updateSerial() {
  if (deviceCtx.device === null) {
    serial = '[Retrieving...]'
    return
  }

  await deviceCtx.device.open()

  try {
    const response = await deviceCtx.device.request({ type: 'GetIdentification' })
    assert(response.type === 'GetIdentification')
    serial = response.value.serial
  } catch (e) {
    console.error(e)
    serial = '[Error]'
  }
}

$effect(() => {
  updateSerial()
})
</script>

<section
  class="flex flex-col lg:flex-row lg:items-center gap-2"
  aria-labelledby="connect-section-label"
>
  <div class="grow">
    <h2 class="font-semibold text-xl/8" id="connect-section-label">Connect to a device</h2>

    <div class="row gap-1 text-sm" aria-live="polite">
      {#if deviceCtx.device === null}
        <IconPending aria-hidden /> Not connected to any device yet. Plug in your device to connect.
      {:else}
        <MoreInfo>
          {#snippet icon()}
            <IconCheckCircle aria-hidden />
          {/snippet}
          The serial ID of this device is <code>{serial}</code>.
        </MoreInfo>
        Successfully conected to device.
      {/if}
    </div>
  </div>

  <!-- <ConnectButton /> -->
</section>
