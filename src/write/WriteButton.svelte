<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { toast } from 'svelte-sonner'

  import IconUpload from '~icons/material-symbols/upload-2'

  interface Props {
    device: HIDDevice | null
    data: number[] | null
    onprogress: (inPropgress: boolean) => void
  }

  const { device, data, onprogress }: Props = $props()
  let inProgress = $state(false)
  let disabled = $derived(device === null || data === null || inProgress)
  let secondary = $derived(device === null)

  async function connectAndWrite() {
    if (device === null || data === null) return

    if (!device.opened) {
      try {
        await device.open()
      } catch (e) {
        toast.error(`Unable to open device: ${e}`)
      }
    }

    const buffer = new Uint8Array(5000)
    for (let y = 0; y < 200; y++) {
      for (let xStride = 0; xStride < 25; xStride++) {
        let cell = 0x0
        for (let xStroll = 0; xStroll < 8; xStroll++) {
          const index = y * 200 + xStride * 8 + xStroll
          cell |= data[index] << xStroll
        }
        buffer[y * 25 + xStride] = cell
      }
    }

    inProgress = true

    try {
      await device.sendReport(0, buffer)
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
