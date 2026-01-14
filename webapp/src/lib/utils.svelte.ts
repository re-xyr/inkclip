import { untrack } from 'svelte'

/**
 * Like $effect(), but requires you to declare dependencies explicitly. Conceptually, `track`
 * should be a pure function that returns the dependencies, and `action` is executed whenever these
 * dependencies change.
 */
export function effect(track: () => unknown, action: () => unknown) {
  $effect(() => {
    track()
    untrack(action)
  })
}
