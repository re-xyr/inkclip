<script lang="ts">
  import { Button } from '$lib/components/ui/button'

  import { toast } from 'svelte-sonner'
  import { getDeviceContext, tryOpenDevice } from '$lib/contexts/device.svelte'
  import { getRenderedContext } from '$lib/contexts/rendered.svelte'
  import {
    BYTES_IN_A_ROW,
    DEVICE_HEIGHT,
    DEVICE_WIDTH,
    SERIAL_NUMBER_REPORT_ID,
    WRITE_PATTERN_REPORT_ID,
    WRITE_TIME,
  } from '$lib/constants'

  interface Props {
    onprogress: (inPropgress: boolean) => void
  }

  const { onprogress }: Props = $props()

  let inProgress = $state(false)

  const deviceCtx = getDeviceContext()
  const renderedCtx = getRenderedContext()

  let disabled = $derived(deviceCtx.device === null || renderedCtx.rendered === null || inProgress)
  let secondary = $derived(deviceCtx.device === null)

  async function connectAndWrite() {
    if (deviceCtx.device === null || renderedCtx.rendered === null) return
    if (!(await tryOpenDevice(deviceCtx.device))) return

    const buffer = new Uint8Array(DEVICE_HEIGHT * BYTES_IN_A_ROW)
    for (let y = 0; y < DEVICE_HEIGHT; y++) {
      for (let xStride = 0; xStride < BYTES_IN_A_ROW; xStride++) {
        let cell = 0x0
        for (let xStroll = 0; xStroll < 8; xStroll++) {
          const index = y * DEVICE_WIDTH + xStride * 8 + xStroll
          cell |= renderedCtx.rendered[index] << xStroll
        }
        buffer[y * BYTES_IN_A_ROW + xStride] = cell
      }
    }

    inProgress = true

    try {
      await deviceCtx.device.sendReport(WRITE_PATTERN_REPORT_ID, buffer)
    } catch (e) {
      toast.error(`Error writing to device: ${e}`)
      return
    } finally {
      setTimeout(() => {
        inProgress = false
      }, WRITE_TIME)
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
