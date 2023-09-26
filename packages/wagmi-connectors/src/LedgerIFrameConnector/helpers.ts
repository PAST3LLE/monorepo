import { isIframe } from '../utils'

export const isLedgerDappBrowserProvider = (() => {
  let state: boolean | null = null

  return (): boolean => {
    if (typeof state === 'boolean') return state
    if (typeof globalThis?.window === 'undefined') return false

    try {
      const params = new URLSearchParams(window.self.location.search)
      const isEmbed = !!params.get('embed')

      state = isIframe() && isEmbed
    } catch (error) {
      state = false
    } finally {
      return !!state
    }
  }
})()
