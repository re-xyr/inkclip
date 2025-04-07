<script lang="ts">
  import { cn, showNumber } from '$lib/utils'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLAttributes<HTMLInputElement>, 'type' | 'inputmode' | 'onchange' | 'value'> {
    min: number
    max: number
    value: number
    onchange: (value: number) => void
  }

  const { min, max, value, onchange, class: classNames, ...restProps }: Props = $props()

  const size = $derived(Math.max(String(min).length, String(max).length))
</script>

<input
  type="text"
  inputmode="numeric"
  class={cn(
    'bg-muted rounded-md focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-1 focus-visible:ring-offset-2 px-1 mx-0.5',
    classNames,
  )}
  {size}
  maxlength={size}
  style:field-sizing="content"
  value={showNumber(value)}
  onchange={e => {
    let n = Number(e.currentTarget.value)

    if (isNaN(n)) {
      e.currentTarget.value = showNumber(value)
      return
    }

    if (n < min) n = min
    if (n > max) n = max

    e.currentTarget.value = showNumber(n)
    onchange(n)
  }}
  {...restProps}
/>
