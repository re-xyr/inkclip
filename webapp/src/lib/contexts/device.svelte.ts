import { Device } from '$lib/image/device'
import { effect } from '$lib/utils.svelte'
import { getContext, setContext } from 'svelte'
import { toast } from 'svelte-sonner'
import type { MidiContext } from './midi.svelte'

function isInkclip(port: MIDIPort): boolean {
  return !!(
    port.manufacturer?.toLowerCase().includes('daylily') ||
    port.name?.toLowerCase().includes('inkclip')
  )
}

export class DeviceContext {
  private midi: MidiContext
  private input: MIDIInput | null = $state(null)
  private output: MIDIOutput | null = $state(null)
  device: Device | null = $state(null)

  constructor(midi: MidiContext) {
    this.midi = midi
    effect(
      () => [this.midi.midi],
      () => this.initialize(),
    )
    effect(
      () => [this.input, this.output],
      () => this.update(),
    )
  }

  private update() {
    if (this.device == null) {
      if (this.input == null || this.output == null) return
      this.device = new Device(this.input, this.output)
      toast.info('Device connected')
    } else {
      if (this.input != null && this.output != null) return
      this.device = null
      toast.info('Device disconnected')
    }
  }

  private async initialize() {
    if (!this.midi.midi) return
    const midi = this.midi.midi

    const inputs = Array.from(midi.inputs.values())
    const outputs = Array.from(midi.outputs.values())
    console.log('MIDI inputs:', Array.from(midi.inputs.values()))
    console.log('MIDI outputs:', Array.from(midi.outputs.values()))

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
  }
}

const DeviceContextToken = Symbol('device')

export function getDeviceContext(): DeviceContext {
  return getContext(DeviceContextToken)
}

export function createDeviceContext(midi: MidiContext): DeviceContext {
  let ctx = new DeviceContext(midi)
  return setContext(DeviceContextToken, ctx)
}
