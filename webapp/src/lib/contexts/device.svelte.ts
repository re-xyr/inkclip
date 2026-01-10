import { Device } from '$lib/image/device'
import { getContext, setContext, untrack } from 'svelte'
import { toast } from 'svelte-sonner'

function isInkclip(port: MIDIPort): boolean {
  return !!(
    port.manufacturer?.toLowerCase().includes('daylily') ||
    port.name?.toLowerCase().includes('inkclip')
  )
}

export class DeviceContext {
  private input: MIDIInput | null = $state(null)
  private output: MIDIOutput | null = $state(null)
  device: Device | null = $state(null)

  constructor() {
    $effect(() => {
      if (untrack(() => this.device == null)) {
        if (this.input == null || this.output == null) return
        this.device = new Device(this.input, this.output)
        toast.info('Device connected')
      } else {
        if (this.input != null && this.output != null) return
        this.device = null
        toast.info('Device disconnected')
      }
    })
  }

  async initialize() {
    try {
      const midi = await navigator.requestMIDIAccess({ sysex: true })
      const inputs = Array.from(midi.inputs.values())
      const outputs = Array.from(midi.outputs.values())
      console.log(
        'MIDI inputs:',
        Array.from(midi.inputs.values()),
        'outputs:',
        Array.from(midi.outputs.values()),
      )

      this.input = inputs.find(isInkclip) ?? null
      this.output = outputs.find(isInkclip) ?? null

      midi.addEventListener('statechange', e => {
        console.log(`MIDI port statechange:`, e.port)
        if (!e.port || !isInkclip(e.port)) return
        if (e.port?.state === 'connected') {
          if (e.port.type === 'input' && !this.input) this.input = e.port as MIDIInput
          else if (e.port.type === 'output' && !this.output) this.output = e.port as MIDIOutput
        } else {
          if (e.port.type === 'input' && e.port === this.input) this.input = null
          else if (e.port.type === 'output' && e.port === this.output) this.output = null
        }
      })
    } catch (e) {
      toast.error(`Failed to acquire MIDI access: ${e}`)
    }
  }
}

const DeviceContextToken = Symbol('device')

export function getDeviceContext(): DeviceContext {
  return getContext(DeviceContextToken)
}

export function createDeviceContext(): DeviceContext {
  let ctx = new DeviceContext()
  return setContext(DeviceContextToken, ctx)
}
