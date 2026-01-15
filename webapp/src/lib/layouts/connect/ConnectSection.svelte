<script lang="ts">
import MoreInfo from '$lib/components/MoreInfo.svelte'
import { Separator } from '$lib/components/ui/separator'
import { getDeviceContext } from '$lib/contexts/device.svelte'
import { assert } from '$lib/utils'
import IconCheckCircle from '~icons/material-symbols/check-circle'
import IconPending from '~icons/material-symbols/pending'
import ConnectButton from './ConnectButton.svelte'

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

<section aria-labelledby="connect-section-label">
  <div class="mx-6 mt-6 mb-4 stack gap-2 md:row xl:mx-0">
    <div class="grow">
      <h2 class="text-xl/8 font-semibold" id="connect-section-label">Connect to a device</h2>

      <div class="stack-h gap-1 text-sm" aria-live="polite">
        {#if deviceCtx.device === null}
          <IconPending class="mt-0.5 shrink-0" aria-hidden /> Not connected to any device yet. Plug in
          your device to connect.
        {:else}
          <MoreInfo class="shrink-0">
            {#snippet icon()}
              <IconCheckCircle aria-hidden />
            {/snippet}
            The serial ID of this device is <code>{serial}</code>.
          </MoreInfo>
          Successfully connected to device.
        {/if}
      </div>
    </div>

    <!-- <ConnectButton /> -->
  </div>

  <Separator decorative />
</section>
