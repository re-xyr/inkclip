<script lang="ts">
import { Separator } from '$lib/components/ui/separator'
import PreviewSection from './preview/PreviewSection.svelte'
import ControlsSection from './controls/ControlsSection.svelte'

import { MediaQuery } from 'svelte/reactivity'

const mediaLg = new MediaQuery('min-width: 1024px')
const separatorOrientation = $derived(mediaLg.current ? 'vertical' : 'horizontal')
</script>

<div class="grow flex flex-col lg:flex-row gap-4">
  <PreviewSection />

  <Separator decorative orientation={separatorOrientation} />

  <ControlsSection />
</div>
