<script lang="ts">
  import { Button } from '$lib/components/ui/button'

  import { DEVICE_PID, DEVICE_VID } from '$lib/constants'
  import { getDeviceContext } from '$lib/contexts/device.svelte'

  const deviceCtx = getDeviceContext()

  async function requestDevice() {
    const devs = await navigator.hid.requestDevice({
      filters: [
        {
          vendorId: DEVICE_VID,
          productId: DEVICE_PID,
        },
      ],
    })

    if (devs == undefined || devs[0] == undefined) return
    deviceCtx.device = devs[0]
  }
</script>

<Button variant={deviceCtx.device === null ? 'default' : 'secondary'} onclick={requestDevice}>
  {#if deviceCtx.device === null}
    Select device
  {:else}
    Connect to another device
  {/if}
</Button>
