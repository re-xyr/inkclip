<script lang="ts">
  interface Props {
    device: HIDDevice | null
    data: number[] | null
    onprogress: (inPropgress: boolean) => void
  }

  const { device, data, onprogress }: Props = $props()
  let inProgress = $state(false)
  let disabled = $derived(device === null || data === null || inProgress)

  async function connectAndWrite() {
    if (device === null || data === null) return

    if (!device.opened) {
      try {
        await device.open()
      } catch (e) {
        if (!(e instanceof Error)) throw e
        alert('Unable to open device: ' + e.toString())
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
    setTimeout(() => {
      inProgress = false
    }, 2000)

    await device.sendReport(0, buffer)
  }

  $effect(() => {
    onprogress(inProgress)
  })
</script>

<button onclick={connectAndWrite} {disabled}>Write pattern to device</button>
