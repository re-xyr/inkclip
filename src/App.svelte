<script lang="ts">
  import { ModeWatcher } from 'mode-watcher'
  import { Toaster } from 'svelte-sonner'

  import Footer from '$lib/layouts/Footer.svelte'
  import Main from '$lib/layouts/Main.svelte'
  import Unsupported from '$lib/layouts/Unsupported.svelte'

  const unsupported = navigator.hid === undefined
</script>

<ModeWatcher />
<Toaster position="bottom-center" duration={2000} />

<div class="max-w-screen-xl min-h-screen m-auto p-8 flex flex-col gap-4">
  {#if unsupported}
    <Unsupported class="grow" />
  {:else}
    <Main class="grow" />
  {/if}
  <Footer />
</div>
