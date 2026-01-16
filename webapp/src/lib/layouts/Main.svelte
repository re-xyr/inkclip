<script lang="ts">
import { createConversionConfig } from '$lib/contexts/config.svelte'
import { createDeviceContext } from '$lib/contexts/device.svelte'
import { createFilesContext } from '$lib/contexts/files.svelte'
import { createImageContext } from '$lib/contexts/image.svelte'
import { createMidiContext } from '$lib/contexts/midi.svelte'
import { createRenderedContext } from '$lib/contexts/rendered.svelte'
import ConnectSection from '$lib/layouts/connect/ConnectSection.svelte'
import EditSection from '$lib/layouts/edit/EditSection.svelte'
import WriteSection from '$lib/layouts/write/WriteSection.svelte'
import { effect } from '$lib/utils.svelte'
import { onMount } from 'svelte'
import { MediaQuery } from 'svelte/reactivity'
import PermissionDeniedDialog from './dialog/PermissionDeniedDialog.svelte'
import PermissionRequestDialog from './dialog/PermissionRequestDialog.svelte'
import UnsupportedDialog from './dialog/UnsupportedDialog.svelte'

const midiCtx = createMidiContext()
createDeviceContext(midiCtx)
const config = createConversionConfig()
const filesCtx = createFilesContext()
const imageCtx = createImageContext(filesCtx)
createRenderedContext(imageCtx, config)

const isStandalone = new MediaQuery('(display-mode: standalone)')

effect(
  () => [isStandalone.current],
  async () => {
    console.log('App is running in standalone mode:', isStandalone.current)
    if (!isStandalone.current) return
    if (!navigator.storage || !navigator.storage.persist) return
    if (await navigator.storage.persisted()) {
      console.log('Storage is already persisted')
      return
    }
    try {
      const persisted = await navigator.storage.persist()
      console.log('Storage persisted:', persisted)
    } catch (e) {
      console.error('Error while requesting storage persistence:', e)
    }
  },
)

onMount(async () => {
  await midiCtx.initialize()
})
</script>

<main class="stack w-full grow gap-4">
  <h1 class="sr-only">Write to Inkclip</h1>

  <ConnectSection />
  <EditSection />
  <WriteSection />

  <PermissionRequestDialog open={midiCtx.perm === 'prompt'} />
  <PermissionDeniedDialog open={midiCtx.perm === 'denied'} />
  <UnsupportedDialog open={midiCtx.perm === 'unsupported'} />
</main>
