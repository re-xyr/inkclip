<script lang="ts">
  import IconPending from '~icons/material-symbols/pending'
  import IconCheckCircle from '~icons/material-symbols/check-circle'
  import ConnectButton from './ConnectButton.svelte'

  import { getDeviceContext, tryOpenDevice } from '$lib/contexts/device.svelte'
  import MoreInfo from '$lib/components/MoreInfo.svelte'
  import { SERIAL_NUMBER_REPORT_ID } from '$lib/constants'

  const deviceCtx = getDeviceContext()

  let serial = $state('[Retrieving...]')

  async function updateSerial() {
    if (deviceCtx.device === null) {
      serial = '[Retrieving...]'
      return
    }

    if (!(await tryOpenDevice(deviceCtx.device))) {
      serial = '[Error]'
      return
    }

    let updated = false
    function setSerial(e: HIDInputReportEvent) {
      if (updated || e.reportId !== SERIAL_NUMBER_REPORT_ID) return
      serial = String.fromCharCode(...Array.from(new Uint8Array(e.data.buffer)))
      updated = true
    }

    deviceCtx.device.addEventListener('inputreport', setSerial)
    await deviceCtx.device.sendReport(SERIAL_NUMBER_REPORT_ID, new Uint8Array(1))
  }

  $effect(() => {
    updateSerial()
  })
</script>

<section class="row gap-2 max-lg:stack max-lg:items-stretch" aria-labelledby="connect-section-label">
  <div class="grow">
    <h2 class="font-semibold text-xl/8" id="connect-section-label">Connect to a device</h2>

    <div class="row gap-1 text-sm" aria-live="polite">
      {#if deviceCtx.device === null}
        <IconPending aria-hidden /> Not connected to any device yet. Plug in your device, and click on the button to select
        it.
      {:else}
        <MoreInfo>
          {#snippet icon()}
            <IconCheckCircle aria-hidden />
          {/snippet}
          The serial ID of this device is <code>{serial}</code>.
        </MoreInfo>
        Successfully conected to device. If you want to, you can connect to another device instead.
      {/if}
    </div>
  </div>

  <ConnectButton />
</section>
