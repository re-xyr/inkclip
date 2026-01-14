<script lang="ts">
import Footer from '$lib/layouts/Footer.svelte'
import Main from '$lib/layouts/Main.svelte'
import { ModeWatcher, mode } from 'mode-watcher'
import { Toaster } from 'svelte-sonner'
</script>

<ModeWatcher />
<Toaster position="bottom-center" duration={2000} theme={mode.current} invert />

<div class="m-auto stack min-h-dvh max-w-7xl gap-4 p-6 lg:py-8">
  <Main />
  <Footer />
</div>
