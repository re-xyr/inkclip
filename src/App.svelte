<script lang="ts">
  import { ModeWatcher } from 'mode-watcher'
  import { Toaster } from 'svelte-sonner'

  import Footer from './Footer.svelte'
  import Main from './Main.svelte'
  import Unsupported from './Unsupported.svelte'

  const unsupported = navigator.hid === undefined
</script>

<ModeWatcher />
<Toaster position="bottom-center" duration={2000} />

<div class="max-w-screen-xl min-h-screen m-auto p-8 flex flex-col gap-4">
  {#if unsupported}
    <Unsupported />
    <div class="grow"></div>
  {:else}
    <Main class="grow" />
  {/if}
  <Footer />
</div>
