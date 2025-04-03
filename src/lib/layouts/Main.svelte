<script lang="ts">
  import { Separator } from '$lib/components/ui/separator'
  import ConnectSection from '$lib/layouts/connect/ConnectSection.svelte'
  import EditSection from '$lib/layouts/edit/EditSection.svelte'
  import WriteSection from '$lib/layouts/write/WriteSection.svelte'

  import { createDeviceContext } from '$lib/contexts/device.svelte'
  import { createConversionConfig } from '$lib/contexts/config.svelte'
  import { createFilesContext } from '$lib/contexts/files.svelte'
  import { createImageContext } from '$lib/contexts/image.svelte'
  import { createRenderedContext } from '$lib/contexts/rendered.svelte'

  createDeviceContext()
  const config = createConversionConfig()
  const filesCtx = createFilesContext()
  const imageCtx = createImageContext(filesCtx)
  createRenderedContext(imageCtx, config)
</script>

<main class="grow w-full stack gap-4">
  <ConnectSection />

  <Separator decorative />

  <EditSection />

  <Separator decorative />

  <WriteSection />
</main>
