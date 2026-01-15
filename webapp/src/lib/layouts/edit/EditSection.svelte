<script lang="ts">
import { Separator } from '$lib/components/ui/separator'
import { MediaQuery } from 'svelte/reactivity'
import ControlsSection from './controls/ControlsSection.svelte'
import PreviewSection from './preview/PreviewSection.svelte'

const mediaLg = new MediaQuery('min-width: 1024px')
const separatorOrientation = $derived(mediaLg.current ? 'vertical' : 'horizontal')
</script>

<div class="mx-6 flex grow flex-col gap-4 lg:flex-row xl:mx-0">
  <PreviewSection />

  <Separator decorative orientation={separatorOrientation} />

  <ControlsSection />
</div>
