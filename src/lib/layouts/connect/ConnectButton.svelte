<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { getDeviceContext } from '$lib/contexts/device.svelte'

  const deviceCtx = getDeviceContext()

  async function requestDevice() {
    const devs = await navigator.hid.requestDevice({
      filters: [
        {
          vendorId: 0xc0de,
          productId: 0xcafe,
        },
      ],
    })

    if (devs == undefined || devs[0] == undefined) {
      return
    }

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
