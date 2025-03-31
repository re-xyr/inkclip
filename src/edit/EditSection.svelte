<script lang="ts">
  import { Transform, withTransform } from '$lib/image/transform'
  import { DEFAULT_DITHERING_KERNEL, Quantizer, type DitheringKernel } from '$lib/image/quantizer'
  import { Scaler, type ScaleMode } from '$lib/image/scaler'

  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils'

  import { Separator } from '$lib/components/ui/separator'

  import PreviewSection from './preview/PreviewSection.svelte'
  import ControlsSection from './controls/ControlsSection.svelte'

  const scaler = new Scaler(200, 200)

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    onchange: (bitmap: number[] | null) => void
  }

  const { onchange, class: classNames, ...restProps }: Props = $props()

  const mobileMediaQuery = matchMedia('(max-width: 1024px)')
  let mobile = $state(mobileMediaQuery.matches)
  const separatorOrientation = $derived(mobile ? 'horizontal' : 'vertical')

  $effect(() => {
    mobileMediaQuery.addEventListener('change', self => {
      mobile = self.matches
    })
  })

  let imageCanvasEl: HTMLCanvasElement

  let imageBitmap: ImageBitmap | null = $state(null)

  let scaleMode: ScaleMode = $state('fit')
  let transform: Transform = $state(new Transform())
  let backgroundColor: number = $state(255)
  let ditheringKernel: DitheringKernel | null = $state(DEFAULT_DITHERING_KERNEL)
  let contrast = $state(0)
  let bias = $state(0)

  let renderedBitmap: number[] | null = $state(null)

  const quantizer = $derived(
    new Quantizer({
      ditheringKernel,
      contrast,
      bias,
    }),
  )

  async function renderPattern() {
    if (imageBitmap === null) {
      renderedBitmap = null
      return
    }

    const ctx = imageCanvasEl.getContext('2d', {
      willReadFrequently: true,
    })!

    withTransform(ctx, transform, () => {
      const nonNullBitmap = imageBitmap!

      ctx.fillStyle = `rgb(${backgroundColor} ${backgroundColor} ${backgroundColor})`
      ctx.fillRect(0, 0, 200, 200)
      const { dx, dy, dWidth, dHeight } = scaler.scale(nonNullBitmap, scaleMode)
      ctx.drawImage(nonNullBitmap, dx, dy, dWidth, dHeight)
    })

    const quantizedData = quantizer.reduce(ctx)
    renderedBitmap = quantizedData
  }

  $effect(() => {
    renderPattern()
  })

  $effect(() => {
    onchange(renderedBitmap)
  })
</script>

<div class={cn('flex max-lg:flex-col gap-4', classNames)} {...restProps}>
  <canvas class="hidden" width={200} height={200} bind:this={imageCanvasEl}></canvas>

  <PreviewSection
    bitmap={renderedBitmap}
    onchange={v => {
      imageBitmap = v
    }}
  />

  <Separator orientation={separatorOrientation} />

  <ControlsSection
    class="grow"
    {imageBitmap}
    bind:scaleMode
    bind:transform
    bind:backgroundColor
    bind:ditheringKernel
    bind:contrast
    bind:bias
  />
</div>
