<script lang="ts">
import { cn, showNumber } from '$lib/utils'
import type { HTMLAttributes } from 'svelte/elements'

interface Props extends Omit<
  HTMLAttributes<HTMLInputElement>,
  'type' | 'inputmode' | 'onchange' | 'value'
> {
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
    'mx-0.5 rounded-md bg-muted px-1 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
    classNames,
  )}
  maxlength={size}
  value={showNumber(value)}
  style="--size: calc({size}ch + 0.5rem)"
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

<style>
@supports (field-sizing: content) {
  input {
    field-sizing: content;
  }
}

@supports (not (field-sizing: content)) {
  input {
    width: var(--size);
  }
}
</style>
