<script lang="ts">
  import Canvas from './lib/Canvas.svelte'
  import ConnectButton from './lib/ConnectButton.svelte'
  import WriteButton from './lib/WriteButton.svelte'

  const hid = navigator.hid

  let inProgress = $state(false)
  let device: HIDDevice | null = $state(null)
  let bitmapData: number[] | null = $state(null)

  function isInkclip(dev: HIDDevice) {
    return dev.vendorId == 0xc0de && dev.productId == 0xcafe
  }

  async function tryGetPairedDevice() {
    const dev = (await hid.getDevices()).find(isInkclip)
    if (dev !== undefined) device = dev
  }

  hid.addEventListener('connect', e => {
    if (isInkclip(e.device) && device === null) device = e.device
  })

  hid.addEventListener('disconnect', e => {
    if (device === e.device) device = null
  })

  $effect(() => {
    tryGetPairedDevice()
  })
</script>

<main>
  <section class="section--connect">
    <div class="section-text">
      <h1 class="section-title">Connect to a device</h1>

      {#if device !== null}
        Successfully conected to device. If you want to, you can connect to another device instead.
      {:else}
        Not connected to any device yet. Plug in your device, and click the button to select it.
      {/if}
    </div>

    <ConnectButton
      onconnect={dev => {
        device = dev
      }}
      {device}
    />
  </section>

  <section class="section--edit">
    <h1 class="section-title">Choose an image</h1>

    <Canvas
      onchange={v => {
        bitmapData = v
      }}
    />
  </section>

  <section class="section--write">
    <div class="section-text">
      <h1 class="section-title">Write pattern to device</h1>

      {#if device === null}
        Connect your device to start writing patterns onto it.
      {:else if bitmapData === null}
        Select an image file in order to write it onto your device.
      {:else if !inProgress}
        Write the pattern onto your device if you have finished editing the image.
      {:else}
        Writing in progress. Do not disconnect device.
      {/if}
    </div>

    <WriteButton
      {device}
      data={bitmapData}
      onprogress={v => {
        inProgress = v
      }}
    />
  </section>
</main>

<style>
  main {
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;
    min-height: 100vh;
  }

  section {
    background-color: #fff1;
    padding: 1em;
    border-radius: 5px;
    flex-grow: 0;
  }

  .section-text {
    flex-grow: 1;
  }

  .section-title {
    margin: 0;
    line-height: 1.5em;
  }

  .section--connect,
  .section--write {
    display: flex;
  }

  .section--edit {
    flex-grow: 1;
  }

  @media (prefers-color-scheme: light) {
    section {
      background-color: #0001;
    }
  }
</style>
