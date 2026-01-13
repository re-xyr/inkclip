<script lang="ts">
import { Separator } from '$lib/components/ui/separator'
import ConnectSection from '$lib/layouts/connect/ConnectSection.svelte'
import EditSection from '$lib/layouts/edit/EditSection.svelte'
import WriteSection from '$lib/layouts/write/WriteSection.svelte'

import { createDeviceContext } from '$lib/contexts/device.svelte'
import { createConversionConfig } from '$lib/contexts/config.svelte'
import { createFilesContext } from '$lib/contexts/files.svelte'
import { createImageContext } from '$lib/contexts/image.svelte'
import { createRenderedContext } from '$lib/contexts/rendered.svelte'
import { createMidiContext } from '$lib/contexts/midi.svelte'
import { onMount } from 'svelte'
import PermissionRequestDialog from './dialog/PermissionRequestDialog.svelte'
import PermissionDeniedDialog from './dialog/PermissionDeniedDialog.svelte'
import UnsupportedDialog from './dialog/UnsupportedDialog.svelte'

const midiCtx = createMidiContext()
createDeviceContext(midiCtx)
const config = createConversionConfig()
const filesCtx = createFilesContext()
const imageCtx = createImageContext(filesCtx)
createRenderedContext(imageCtx, config)

onMount(async () => {
  await midiCtx.initialize()
})
</script>

<main class="grow w-full stack gap-4">
  <h1 class="sr-only">Write to Inkclip</h1>

  <ConnectSection />

  <Separator decorative />

  <EditSection />

  <Separator decorative />

  <WriteSection />

  <PermissionRequestDialog open={midiCtx.perm === 'prompt'} />
  <PermissionDeniedDialog open={midiCtx.perm === 'denied'} />
  <UnsupportedDialog open={midiCtx.perm === 'unsupported'} />
</main>
