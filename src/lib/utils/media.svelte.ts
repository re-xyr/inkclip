export interface ReactiveMediaQuery {
  readonly matches: boolean
}

export function createMediaQuery(query: string): ReactiveMediaQuery {
  const queryList = matchMedia(query)

  const queryState = $state({ matches: queryList.matches })

  queryList.addEventListener('change', self => {
    queryState.matches = self.matches
  })

  return queryState
}
