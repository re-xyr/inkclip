<script lang="ts">
  import IconPending from '~icons/material-symbols/pending'
  import IconWarning from '~icons/material-symbols/warning'
  import IconArrowUploadProgress from '~icons/material-symbols/arrow-upload-progress'

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

    {#if device === null}
      <IconPending class="inline" /> Connect your device to start writing patterns onto it.
    {:else if bitmap === null}
      <IconPending class="inline" /> Select an image file in order to write it onto your device.
    {:else if !inProgress}
      <IconArrowUploadProgress class="inline" /> Write the pattern onto your device if you have finished editing the image.
    {:else}
      <IconWarning class="inline" /> Update in progress. Do not disconnect device.
    {/if}
  </div>

  <WriteButton
    {device}
    data={bitmap}
    onprogress={v => {
      inProgress = v
    }}
  />
</section>
