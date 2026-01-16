<script lang="ts">
import Footer from '$lib/layouts/Footer.svelte'
import Main from '$lib/layouts/Main.svelte'
import { ModeWatcher, mode } from 'mode-watcher'
import { Toaster } from 'svelte-sonner'
</script>

<svelte:head>
  <meta name="theme-color" content={mode.current === 'dark' ? '#0c0a09' : '#ffffff'} />
</svelte:head>

<ModeWatcher />
<Toaster position="bottom-center" duration={2000} theme={mode.current} invert />

<div class="m-auto stack min-h-dvh max-w-[calc(var(--container-7xl)-2*6*var(--spacing))]">
  <Main />
  <Footer />
</div>
