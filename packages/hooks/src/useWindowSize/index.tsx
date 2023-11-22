import { MEDIA_WIDTHS, MediaWidths } from '@past3lle/theme'
import { devDebug } from '@past3lle/utils'
import throttle from 'lodash.throttle'
import { ReactNode, useEffect, useState } from 'react'
import { snapshot, subscribe, useSnapshot } from 'valtio'

import { setDimensions, state } from './state'

// Use global window proxies
if (_checkWindowExists()) {
  !window.__PSTL_HOOKS_WINDOW_SIZE_PROXY_STATE && (window.__PSTL_HOOKS_WINDOW_SIZE_PROXY_STATE = state)
  !window.__PSTL_HOOKS_WINDOW_SIZE_PROXY_STATE_SET_DIMENSIONS &&
    (window.__PSTL_HOOKS_WINDOW_SIZE_PROXY_STATE_SET_DIMENSIONS = setDimensions)
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
  const snapState = useSnapshot(_checkWindowExists() ? globalThis.window.__PSTL_HOOKS_WINDOW_SIZE_PROXY_STATE : state)

  useEffect(() => {
    if (!_checkWindowExists()) return

    // cache global constants
    const WIN = globalThis.window
    const GLOBAL_LISTENER = WIN?.__PSTL_HOOKS_CONTEXT_LISTENER
    const GLOBAL_LISTENER_COUNT = WIN?.__PSTL_HOOKS_CONTEXT_LISTENER_COUNT || 0

    // bail out if we already have listeners active
    if (GLOBAL_LISTENER_COUNT >= 1) {
      devDebug(
        '[@past3lle/hooks:useSetupCachedWindowResizeListeners] Listener already active. Not pushing new handler to existing listener list'
      )
    }

    // Create resize handler
    const handleResizeRequests = (_e?: Event) =>
      throttle(function handleCheckWindowSize() {
        const sizes = _getSize()
        window.__PSTL_HOOKS_WINDOW_SIZE_PROXY_STATE_SET_DIMENSIONS(sizes)
      }, options?.throttleMs || 150)()

    // create init logic
    // IF no global listener OR no listener count, create
    // ELSE skip and log
    _setupListenersOnWindowOrLog(handleResizeRequests, {
      windowOb: WIN,
      globalListener: GLOBAL_LISTENER,
      globalListenerCount: GLOBAL_LISTENER_COUNT
    })
    // iterate over listeners count and update
    _iterateListenerCount(WIN)

    return () => {
      // Remove listener completely only if the listener list is on it's last listener (else others are still active)
      if (!!GLOBAL_LISTENER && GLOBAL_LISTENER_COUNT <= 1) {
        WIN?.removeEventListener('resize', GLOBAL_LISTENER)
        delete WIN?.__PSTL_HOOKS_CONTEXT_LISTENER
      }
    }
  }, [])

  return snapState
}

/**
 * @name useWindowSize
 * @description Listens to globalThis.window resize events and updates via CONTEXT. This requires you to FIRST place the WindowSizeProvider somewhere in your app ABOVE your intended use of this hook
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
    _checkWindowExists() ? globalThis.window.__PSTL_HOOKS_WINDOW_SIZE_PROXY_STATE : undefined
  )

  // Subscribe to changes in proxy state
  useEffect(() => {
    if (!_checkWindowExists()) return
    const state = globalThis.window.__PSTL_HOOKS_WINDOW_SIZE_PROXY_STATE
    const unsub = subscribe(state, () => setState(snapshot(state)))

    return () => {
      unsub()
    }
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

export interface WindowSizeProviderOptions {
  windowSizes?: {
    throttleMs?: number
  }
}
/**
 * @name WindowSizeProvider
 * @description required to place ABOVE intended use of useWindowSize hook
 * @param providerOptions
 * @deprecated Deprecated. Just use useWindowSize hook directly.
 * @returns children
 */
export function WindowSizeProvider(props?: { children?: ReactNode } & WindowSizeProviderOptions) {
  return props?.children
}

function _checkWindowExists() {
  return typeof globalThis?.window !== 'undefined'
}

function _getSize(): WindowSizes {
  return {
    width:
      globalThis?.window?.innerWidth ||
      globalThis?.window?.document?.documentElement?.clientWidth ||
      globalThis?.window?.document?.body?.clientWidth,
    height:
      globalThis?.window?.innerHeight ||
      globalThis?.window?.document?.documentElement?.clientHeight ||
      globalThis?.window?.document?.body?.clientHeight,
    get ar() {
      if (!_checkWindowExists() || !this.width || !this.height) return undefined
      // round the number to 2 decimal places
      return Math.round((this.width / (this.height + Number.EPSILON)) * 100) / 100
    }
  }
}

function _setupListenersOnWindowOrLog(
  handleResize: (_e?: Event) => void,
  globalStore: {
    windowOb: Window
    globalListener: typeof window.__PSTL_HOOKS_CONTEXT_LISTENER
    globalListenerCount: typeof window.__PSTL_HOOKS_CONTEXT_LISTENER_COUNT
  }
) {
  const { globalListener, globalListenerCount, windowOb } = globalStore
  if (!globalListener || !globalListenerCount) {
    // Cache event listeners
    windowOb.__PSTL_HOOKS_CONTEXT_LISTENER = handleResize
    devDebug(
      '[@past3lle/hooks:useSetupCachedWindowResizeListeners] Listener not already active. Setting listener and handler'
    )
    // Call once
    handleResize()
    // Set the listener (hasn't been set yet)
    windowOb.addEventListener('resize', windowOb.__PSTL_HOOKS_CONTEXT_LISTENER)
  }
}

function _iterateListenerCount(windowOb: Window) {
  // Iterate listener count
  if (!windowOb?.__PSTL_HOOKS_CONTEXT_LISTENER_COUNT) {
    windowOb.__PSTL_HOOKS_CONTEXT_LISTENER_COUNT = 1
  } else {
    windowOb.__PSTL_HOOKS_CONTEXT_LISTENER_COUNT += 1
  }
}
