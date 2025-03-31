<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils'

  import { Separator } from '$lib/components/ui/separator'

  import ConnectSection from './connect/ConnectSection.svelte'
  import EditSection from './edit/EditSection.svelte'
  import WriteSection from './write/WriteSection.svelte'

  interface Props extends HTMLAttributes<HTMLElement> {}

  const { class: classNames, ...restProps }: Props = $props()

  let device: HIDDevice | null = $state(null)
  let bitmap: number[] | null = $state(null)
</script>

<main class={cn('w-full flex flex-col gap-4', classNames)} {...restProps}>
  <ConnectSection
    {device}
    onchange={v => {
      device = v
    }}
  />

  <Separator />

  <EditSection
    class="grow"
    onchange={v => {
      bitmap = v
    }}
  />

  <Separator />

  <WriteSection {device} {bitmap} />
</main>
