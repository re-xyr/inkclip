<script lang="ts">
import { Input } from '$lib/components/ui/input'

import { getFilesContext } from '$lib/contexts/files.svelte'

interface Props {
  ref?: HTMLInputElement | null
}

let { ref = $bindable(null) }: Props = $props()

const filesCtx = getFilesContext()
</script>

<Input
  bind:ref
  type="file"
  accept="image/*"
  bind:files={filesCtx.files}
  class="font-normal file-input"
  aria-labelledby="preview-section-label"
/>

<style>
:global(.file-input::file-selector-button) {
  font-weight: 500;
  padding-right: 0.25rem;
}
</style>
