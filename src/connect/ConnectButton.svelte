<script lang="ts">
  import { Button } from '$lib/components/ui/button'

  const hid = navigator.hid

  interface Props {
    onconnect: (device: HIDDevice) => void
    device: HIDDevice | null
  }

  const { onconnect, device }: Props = $props()

  async function requestDevice() {
    const devs = await hid.requestDevice({
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

    onconnect(devs[0])
  }
</script>

<Button variant={device === null ? 'default' : 'secondary'} onclick={requestDevice}>
  {#if device === null}
    Select device
  {:else}
    Connect to another device
  {/if}
</Button>
