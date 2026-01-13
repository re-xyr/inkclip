import { getContext, setContext } from 'svelte'

export class MidiContext {
  // Value before initialize() should not be relied upon. 'granted' is used as
  // initial value purely because it doesn't bring up a flash of dialog on
  // page load.
  perm: 'unsupported' | PermissionState = $state('granted')
  midi: MIDIAccess | null = $state(null)

  async initialize() {
    if (navigator.requestMIDIAccess == null) {
      // This browser definitely doesn't support Web MIDI
      this.perm = 'unsupported'
      return
    }

    // We decide how to acquire MIDI access based on likelyPerm:
    // - 'granted': we should try implicitly acquiring MIDI access.
    // - 'prompt': we should display a dialog explaining why we need MIDI
    //   before trying to acquire.
    // - 'denied': we are denied MIDI access.
    let likelyPerm: PermissionState

    if (navigator.permissions == null) {
      // We don't know our permissions. Try to acquire implicitly nonetheless,
      // since we think the advantage of auto-connect outweighs the browser
      // prompting the user without warning
      likelyPerm = 'granted'
    } else {
      try {
        const status = await navigator.permissions.query({
          name: 'midi',
          sysex: true,
        } as PermissionDescriptor)
        console.log('MIDI permission status:', status)
        likelyPerm = status.state
        status.addEventListener('change', () => (this.perm = status.state))
      } catch (e) {
        // Non-compliant Permissions API. Since we know requestMIDIAccess is
        // present, try acquiring implicitly nonetheless.
        console.error('Error querying permission:', e)
        likelyPerm = 'granted'
      }
    }

    if (likelyPerm === 'granted') await this.acquire()
    else this.perm = likelyPerm
  }

  // Attempt to acquire MIDI access. If permission isn't granted already, this
  // will likely cause the browser to prompt the user.
  async acquire() {
    try {
      this.midi = await navigator.requestMIDIAccess({ sysex: true })
      this.perm = 'granted'
    } catch (e) {
      // The user or OS denied us access, or no support
      console.error('Error acquiring MIDI access:', e)
      this.perm = 'denied'
    }
  }
}

const MidiContextToken = Symbol('midi')

export function getMidiContext(): MidiContext {
  return getContext(MidiContextToken)
}

export function createMidiContext(): MidiContext {
  return setContext(MidiContextToken, new MidiContext())
}
