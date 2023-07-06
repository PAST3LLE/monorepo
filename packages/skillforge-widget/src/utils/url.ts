import { ForgeSearchParamKeys } from '../state'

function _updateURL(searchParams: URLSearchParams) {
  if (typeof window === undefined) return

  const newURL = new URL(window.location.href)
  newURL.search = searchParams.toString()
  window.history.pushState({ path: newURL.href }, '', newURL.href)
}

export function updateSearchParams(key: ForgeSearchParamKeys, value: string) {
  if (typeof window === undefined) return

  const searchParams = new URLSearchParams(window.location.search)
  searchParams.delete(key)
  searchParams.append(key, value)

  _updateURL(searchParams)
}

export function removeSearchParams(...keys: ForgeSearchParamKeys[]) {
  if (typeof window === undefined) return

  const searchParams = new URLSearchParams(window.location.search)
  keys.forEach((key) => {
    searchParams.delete(key)
  })

  _updateURL(searchParams)
}
