import { MEDIA_WIDTHS, MediaWidths } from '@past3lle/theme'
import { devDebug, devError } from '@past3lle/utils'
import throttle from 'lodash.throttle'
import React, { ReactNode } from 'react'
import { useContext, useEffect, useState } from 'react'

export interface WindowSizes {
  width: number | undefined
  height: number | undefined
  ar: number | undefined
}

export interface UseWindowSizeOptions {
  throttleMs?: number
}

const WindowSizeContext = React.createContext<WindowSizes | undefined>(undefined)

const checkWindow = () => typeof globalThis?.window !== undefined

function useSetupCachedWindowResizeListeners(options?: UseWindowSizeOptions) {
  const [windowSize, setWindowSize] = useState<WindowSizes>(_getSize)
  useEffect(() => {
    if (!checkWindow()) return

    const throttledCb = throttle(function handleCheckWindowSize() {
      setWindowSize(_getSize)
    }, options?.throttleMs || 150)

    function handleResizeRequests(e: Event) {
      globalThis.window?.__PSTL_HOOKS_CONTEXT_LISTENERS?.forEach((cb) => cb(e))
    }

    if (!globalThis.window.__PSTL_HOOKS_CONTEXT_LISTENERS?.length) {
      // Cache event listeners
      globalThis.window.__PSTL_HOOKS_CONTEXT_LISTENERS = [throttledCb]
      devDebug(
        '[@past3lle/hooks:useSetupCachedWindowResizeListeners] Listener not already active. Setting listener and handler',
        globalThis.window.__PSTL_HOOKS_CONTEXT_LISTENERS
      )
      // Set the listener (hasn't been set yet)
      globalThis.window.addEventListener('resize', handleResizeRequests)
    } else {
      // Mutate listeners array by pushing new one to end
      globalThis.window.__PSTL_HOOKS_CONTEXT_LISTENERS.push(throttledCb)
      devDebug(
        '[@past3lle/hooks:useSetupCachedWindowResizeListeners] Listener already active. Pushing new handler to existing listener list',
        globalThis.window.__PSTL_HOOKS_CONTEXT_LISTENERS
      )
    }

    return () => {
      // Pop the last from list
      globalThis.window.__PSTL_HOOKS_CONTEXT_LISTENERS?.pop()
      // Remove listener completely only if the listener list is on it's last listener (else others are still active)
      if (globalThis.window.__PSTL_HOOKS_CONTEXT_LISTENERS?.length <= 1) {
        globalThis.window?.removeEventListener('resize', handleResizeRequests)
      }
    }
  }, [options?.throttleMs])

  return windowSize
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
      if (!checkWindow() || !this.width || !this.height) return undefined
      // round the number to 2 decimal places
      return Math.round((this.width / (this.height + Number.EPSILON)) * 100) / 100
    }
  }
}

/**
 * @name useWindowSize
 * @description Listens to globalThis.window resize events and updates via CONTEXT. This requires you to FIRST place the WindowSizeProvider somewhere in your app ABOVE your intended use of this hook
 * @example
 // somewhere in app architecture - e.g render
 // useWindowSize hook used in <App />, below
  root.render(
    <WindowSizeProvider>
      <App />
    </WindowSizeProvider>
  )
 * @returns WindowSizes | undefined - width, height, and aspect ratio of globalThis.window (or undefined if not instantiated)
 */
export function useWindowSize(): WindowSizes | undefined {
  const [context, setContext] = useState<React.Context<WindowSizes | undefined>>(WindowSizeContext)
  useEffect(() => {
    if (!checkWindow()) return
    const context = globalThis.window.__PSTL_HOOKS_CONTEXT || WindowSizeContext

    if (!globalThis.window.__PSTL_HOOKS_CONTEXT) {
      globalThis.window.__PSTL_HOOKS_CONTEXT = WindowSizeContext
    }

    setContext(context)

    return () => {
      globalThis.window.__PSTL_HOOKS_CONTEXT = undefined
    }
  }, [])

  const windowSizeContext = useContext(context as React.Context<WindowSizes | undefined>)
  if (!windowSizeContext) {
    devError(`
      [@past3lle/hooks::useWindowSize] - Missing top level WindowSizeProvider! 
      You are attempting to use this hook outside of a WindowSizeProvider which won't have any effect.

      // somewhere in app architecture - e.g render
      // useWindowSize hook used in <App />, below
      root.render(
        <WindowSizeProvider>
          <App />
        </WindowSizeProvider>
      )
    `)
  }

  return windowSizeContext
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
 * @example
 // OPTIONS INTERFACE
 interface ProviderOptions {
    children?: ReactNode
    windowSizes?: {
      throttleMs?: number
    }
  }
  // EXAMPLE USE
  // somewhere in app architecture
  // e.g render
  root.render(
    // Provider goes here, hook used in "App", below
    <WindowSizeProvider>
      <App />
    </WindowSizeProvider>
  )
 * @returns
 */
export function WindowSizeProvider(props?: { children?: ReactNode } & WindowSizeProviderOptions) {
  const windowSizes = useSetupCachedWindowResizeListeners(props?.windowSizes)
  return <WindowSizeContext.Provider value={windowSizes}>{props?.children}</WindowSizeContext.Provider>
}
