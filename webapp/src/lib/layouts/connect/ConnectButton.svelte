<script lang="ts">
import { Button } from '$lib/components/ui/button'
import { getDeviceContext } from '$lib/contexts/device.svelte'

const deviceCtx = getDeviceContext()
</script>

<Button
  variant={deviceCtx.device === null ? 'default' : 'secondary'}
  onclick={() => {
    /* TODO: */
  }}
>
  {#if deviceCtx.device === null}
    Select device
  {:else}
    Connect to another device
  {/if}
</Button>
