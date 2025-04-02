<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { getBitmapContext } from '$lib/contexts/bitmap.svelte'
  import { getDeviceContext } from '$lib/contexts/device.svelte'
  import { toast } from 'svelte-sonner'

  interface Props {
    onprogress: (inPropgress: boolean) => void
  }

  const { onprogress }: Props = $props()

  let inProgress = $state(false)

  const deviceCtx = getDeviceContext()
  const bitmapCtx = getBitmapContext()

  let disabled = $derived(deviceCtx.device === null || bitmapCtx.rendered === null || inProgress)
  let secondary = $derived(deviceCtx.device === null)

  async function connectAndWrite() {
    if (deviceCtx.device === null || bitmapCtx.rendered === null) return

    if (!deviceCtx.device.opened) {
      try {
        await deviceCtx.device.open()
      } catch (e) {
        toast.error(`Unable to open device: ${e}`)
        return
      }
    }

    const buffer = new Uint8Array(5000)
    for (let y = 0; y < 200; y++) {
      for (let xStride = 0; xStride < 25; xStride++) {
        let cell = 0x0
        for (let xStroll = 0; xStroll < 8; xStroll++) {
          const index = y * 200 + xStride * 8 + xStroll
          cell |= bitmapCtx.rendered[index] << xStroll
        }
        buffer[y * 25 + xStride] = cell
      }
    }

    inProgress = true

    try {
      await deviceCtx.device.sendReport(0, buffer)
    } catch (e) {
      toast.error(`Error writing to device: ${e}`)
      return
    } finally {
      setTimeout(() => {
        inProgress = false
      }, 2000)
    }

    toast.success('Wrote pattern to device')
  }

  $effect(() => {
    onprogress(inProgress)
  })
</script>

<Button onclick={connectAndWrite} variant={secondary ? 'secondary' : 'default'} {disabled}>
  Write pattern to device
</Button>
