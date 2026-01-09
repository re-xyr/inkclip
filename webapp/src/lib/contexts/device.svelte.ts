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
      }
    })
  }

  async initialize() {
    try {
      const midi = await navigator.requestMIDIAccess({ sysex: true })
      console.log(Array.from(midi.inputs.values()), Array.from(midi.outputs.values()))

      this.input = midi.inputs.values().find(isInkclip) ?? null
      this.output = midi.outputs.values().find(isInkclip) ?? null

      midi.addEventListener('statechange', e => {
        console.log(e.port)
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
      toast.error('Failed to acquire MIDI access. Please grant access manually in your browser.')
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
