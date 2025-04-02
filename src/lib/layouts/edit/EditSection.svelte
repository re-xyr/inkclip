<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils'

  import { Separator } from '$lib/components/ui/separator'

  import PreviewSection from './preview/PreviewSection.svelte'
  import ControlsSection from './controls/ControlsSection.svelte'
  import { createMediaQuery } from '$lib/utils/media.svelte'

  interface Props extends HTMLAttributes<HTMLDivElement> {}

  const { class: classNames, ...restProps }: Props = $props()

  const mobileMediaQuery = createMediaQuery('(max-width: 1024px)')
  const separatorOrientation = $derived(mobileMediaQuery.matches ? 'horizontal' : 'vertical')
</script>

<div class={cn('flex max-lg:flex-col gap-4', classNames)} {...restProps}>
  <PreviewSection />

  <Separator orientation={separatorOrientation} />

  <ControlsSection class="grow" />
</div>
