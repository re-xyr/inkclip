<script lang="ts">
  import IconHelp from '~icons/material-symbols/help'
  import IconPending from '~icons/material-symbols/pending'
  import IconArrowUploadProgress from '~icons/material-symbols/arrow-upload-progress'
  import IconWarning from '~icons/material-symbols/warning'

  import WriteButton from './WriteButton.svelte'

  interface Props {
    device: HIDDevice | null
    bitmap: number[] | null
  }

  const { device, bitmap }: Props = $props()

  let inProgress = $state(false)
</script>

<section class="flex items-center gap-2 max-lg:flex-col max-lg:items-stretch">
  <div class="grow">
    <h1 class="font-semibold text-xl/8">Write pattern to device</h1>

    <div class="text-sm">
      {#if device === null}
        <IconHelp class="inline" /> To start writing patterns to your device, connect it first.
      {:else if bitmap === null}
        <IconPending class="inline" /> Select an image file in order to write it onto your device.
      {:else if !inProgress}
        <IconArrowUploadProgress class="inline" /> Write the pattern onto your device if you have finished editing the image.
      {:else}
        <IconWarning class="inline" /> Refresh in progress. Do not disconnect device.
      {/if}
    </div>
  </div>

  <WriteButton
    {device}
    data={bitmap}
    onprogress={v => {
      inProgress = v
    }}
  />
</section>
