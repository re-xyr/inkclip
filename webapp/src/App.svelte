<script lang="ts">
import { mode, ModeWatcher } from 'mode-watcher'
import { Toaster } from 'svelte-sonner'

import Footer from '$lib/layouts/Footer.svelte'
import Main from '$lib/layouts/Main.svelte'
import Unsupported from '$lib/layouts/Unsupported.svelte'

const unsupported = navigator.requestMIDIAccess === undefined
</script>

<ModeWatcher />
<Toaster position="bottom-center" duration={2000} theme={mode.current} invert />

<div class="max-w-7xl min-h-dvh m-auto p-6 stack gap-4">
  {#if unsupported}
    <Unsupported />
  {:else}
    <Main />
  {/if}
  <Footer />
</div>
