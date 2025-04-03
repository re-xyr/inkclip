<script lang="ts">
  import { Separator } from '$lib/components/ui/separator'
  import PreviewSection from './preview/PreviewSection.svelte'
  import ControlsSection from './controls/ControlsSection.svelte'

  import { createMediaQuery } from '$lib/utils/media.svelte'

  const mobileMediaQuery = createMediaQuery('(max-width: 1024px)')
  const separatorOrientation = $derived(mobileMediaQuery.matches ? 'horizontal' : 'vertical')
</script>

<div class="grow stack-h max-lg:stack gap-4">
  <PreviewSection />

  <Separator decorative orientation={separatorOrientation} />

  <ControlsSection />
</div>
