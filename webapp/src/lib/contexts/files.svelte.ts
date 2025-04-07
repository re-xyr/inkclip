import { getContext, setContext } from 'svelte'

export interface FilesContext {
  files: FileList
}

export const FilesContextToken = Symbol('files')

export function getFilesContext(): FilesContext {
  return getContext(FilesContextToken)
}

export function createFilesContext(): FilesContext {
  const ctx: FilesContext = $state({
    files: new DataTransfer().files,
  })

  return setContext(FilesContextToken, ctx)
}
