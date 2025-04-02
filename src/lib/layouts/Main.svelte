<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils'

  import { Separator } from '$lib/components/ui/separator'

  import ConnectSection from '$lib/layouts/connect/ConnectSection.svelte'
  import EditSection from '$lib/layouts/edit/EditSection.svelte'
  import WriteSection from '$lib/layouts/write/WriteSection.svelte'
  import { createDeviceContext } from '$lib/contexts/device.svelte'
  import { createConversionConfig } from '$lib/contexts/config.svelte'
  import { createBitmapContext } from '$lib/contexts/bitmap.svelte'

  interface Props extends HTMLAttributes<HTMLElement> {}

  const { class: classNames, ...restProps }: Props = $props()

  createDeviceContext()
  const config = createConversionConfig()
  createBitmapContext(config)
</script>

<main class={cn('w-full flex flex-col gap-4', classNames)} {...restProps}>
  <ConnectSection />

  <Separator />

  <EditSection class="grow" />

  <Separator />

  <WriteSection />
</main>
