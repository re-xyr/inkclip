import { onDestroy } from 'svelte'

export interface ReactiveMediaQuery {
  readonly matches: boolean
}

export function createMediaQuery(query: string): ReactiveMediaQuery {
  const queryList = matchMedia(query)

  const queryState = $state({ matches: queryList.matches })

  const updateQueryState = (e: MediaQueryListEvent) => (queryState.matches = e.matches)

  queryList.addEventListener('change', updateQueryState)
  onDestroy(() => queryList.removeEventListener('change', updateQueryState))

  return queryState
}
