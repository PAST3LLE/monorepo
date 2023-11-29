import { MEDIA_WIDTHS, MediaWidths } from '@past3lle/theme'
import { devDebug } from '@past3lle/utils'
import throttle from 'lodash.throttle'
import { useEffect, useState } from 'react'
import { snapshot, subscribe } from 'valtio'

import { setDimensions, state } from './state'

const WIN = _checkWindowExists() ? globalThis.window : ({} as Window)

// Use global window proxies
if (_checkWindowExists()) {
  // No global proxy state? or callback? Set it.
  if (!WIN.__PSTL_HOOKS_WINDOW_SIZE_PROXY_STATE) WIN.__PSTL_HOOKS_WINDOW_SIZE_PROXY_STATE = state
  if (!WIN.__PSTL_HOOKS_WINDOW_SIZE_CALLBACK) WIN.__PSTL_HOOKS_WINDOW_SIZE_CALLBACK = setDimensions
}

export interface WindowSizes {
  width: number | undefined
  height: number | undefined
  ar: number | undefined
}

export interface UseWindowSizeOptions {
  throttleMs?: number
}

function useSetupCachedWindowResizeListeners(options?: UseWindowSizeOptions) {
  useEffect(() => {
    if (!_checkWindowExists()) return

    // cache global constants
    const GLOBAL_LISTENER = WIN?.__PSTL_HOOKS_CONTEXT_LISTENER
    const GLOBAL_LISTENER_COUNT = WIN?.__PSTL_HOOKS_CONTEXT_LISTENER_COUNT || 0

    // signal if we already have listeners active
    if (GLOBAL_LISTENER_COUNT >= 1)
      devDebug('[@past3lle/hooks:useSetupCachedWindowResizeListeners] Listener already active. Skipping setup.')

    // Create resize handler
    const handleResizeRequests = (_e?: Event) =>
      throttle(function handleCheckWindowSize() {
        const sizes = _getSize()
        globalThis.window.__PSTL_HOOKS_WINDOW_SIZE_CALLBACK(sizes)
      }, options?.throttleMs || 150)()

    // create init logic
    // IF no global listener OR no listener count, create
    // ELSE skip and log
    _setupListenersOnWindowOrLog(handleResizeRequests, !!GLOBAL_LISTENER, GLOBAL_LISTENER_COUNT)
    // iterate over listeners count and update
    _iterateListenerCount()

    return () => {
      // Remove listener completely only if the listener list is on it's last listener (else others are still active)
      if (!!GLOBAL_LISTENER && GLOBAL_LISTENER_COUNT <= 1) {
        WIN?.removeEventListener('resize', GLOBAL_LISTENER)
        delete WIN?.__PSTL_HOOKS_CONTEXT_LISTENER
      }
    }
  }, [options?.throttleMs])
}

/**
 * @name useWindowSize
 * @description Listens to globalThis.window resize events and updates via proxy state.
 * @example
 // somewhere in app architecture - e.g render
 useWindowSize({ throttleMs: 300 })
 ...
 * @returns WindowSizes | undefined - width, height, and aspect ratio of globalThis.window (or undefined if not instantiated)
 */
export function useWindowSize(options?: UseWindowSizeOptions): WindowSizes | undefined {
  // Setup window resize logic & proxies
  useSetupCachedWindowResizeListeners(options)

  const [localState, setState] = useState<WindowSizes | undefined>(
    _checkWindowExists() ? WIN.__PSTL_HOOKS_WINDOW_SIZE_PROXY_STATE : undefined
  )

  // Subscribe to changes in proxy state
  useEffect(() => {
    if (!_checkWindowExists()) return
    const proxyState = WIN.__PSTL_HOOKS_WINDOW_SIZE_PROXY_STATE
    const unsub = subscribe(proxyState, () => setState(snapshot(proxyState)))

    return unsub
  }, [])

  return localState
}

export function useWindowSmallerThan(media: MediaWidths) {
  const sizes = useWindowSize()

  return Boolean(sizes?.width && sizes.width <= media)
}

export const useIsExtraSmallMediaWidth = () => useWindowSmallerThan(MEDIA_WIDTHS.upToExtraSmall)
export const useIsSmallMediaWidth = () => useWindowSmallerThan(MEDIA_WIDTHS.upToSmall)
export const useIsMediumMediaWidth = () => useWindowSmallerThan(MEDIA_WIDTHS.upToMedium)
export const useIsLargeMediaWidth = () => useWindowSmallerThan(MEDIA_WIDTHS.upToLarge)
export const useIsExtraLargeMediaWidth = () => useWindowSmallerThan(MEDIA_WIDTHS.upToExtraLarge)

function _checkWindowExists() {
  return typeof globalThis?.window !== 'undefined'
}

function _getSize(): WindowSizes {
  return {
    width: WIN?.innerWidth || WIN?.document?.documentElement?.clientWidth || WIN?.document?.body?.clientWidth,
    height: WIN?.innerHeight || WIN?.document?.documentElement?.clientHeight || WIN?.document?.body?.clientHeight,
    get ar() {
      if (!_checkWindowExists() || !this.width || !this.height) return undefined
      // round the number to 2 decimal places
      return Math.round((this.width / (this.height + Number.EPSILON)) * 100) / 100
    }
  }
}

function _setupListenersOnWindowOrLog(
  handleResize: (_e?: Event) => void,
  hasGlobalListener?: boolean,
  globalListenerCount = 0
) {
  if (!hasGlobalListener || !globalListenerCount) {
    // Cache event listeners
    WIN.__PSTL_HOOKS_CONTEXT_LISTENER = handleResize
    devDebug(
      '[@past3lle/hooks:useSetupCachedWindowResizeListeners] No listener detected! Setting up window size listener.'
    )
    // Call once
    handleResize()
    WIN.addEventListener('resize', WIN.__PSTL_HOOKS_CONTEXT_LISTENER)
  }
}

function _iterateListenerCount() {
  // Iterate listener count
  if (!WIN?.__PSTL_HOOKS_CONTEXT_LISTENER_COUNT) {
    WIN.__PSTL_HOOKS_CONTEXT_LISTENER_COUNT = 1
  } else {
    WIN.__PSTL_HOOKS_CONTEXT_LISTENER_COUNT += 1
  }
}
