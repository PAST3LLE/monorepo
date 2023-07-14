import { MEDIA_WIDTHS, MediaWidths } from '@past3lle/theme'
import debounce from 'lodash.debounce'
import React, { ReactNode } from 'react'
import { useContext, useEffect, useState } from 'react'

export interface WindowSizes {
  width: number | undefined
  height: number | undefined
  ar: number | undefined
}

export interface UseWindowSizeOptions {
  debounceMs?: number
}

const WindowSizeContext = React.createContext<WindowSizes | undefined>(undefined)

const checkWindow = () => typeof globalThis?.window !== undefined

function useWindowSizeSetup(options?: UseWindowSizeOptions) {
  const [windowSize, setWindowSize] = useState<WindowSizes>(_getSize)
  useEffect(() => {
    if (!checkWindow()) return

    // Cache event listeners
    if (!globalThis.window.__PSTL_HOOKS_CONTEXT_LISTENERS) {
      globalThis.window.__PSTL_HOOKS_CONTEXT_LISTENERS = []
    }

    // Remove previous event listeners and keep latest
    globalThis.window.__PSTL_HOOKS_CONTEXT_LISTENERS.forEach((cb) =>
      globalThis.window.removeEventListener('resize', cb as EventListener)
    )

    const debouncedCb = debounce(function handleCheckWindowSize() {
      setWindowSize(_getSize)
    }, options?.debounceMs || 150)

    globalThis.window.addEventListener('resize', debouncedCb as EventListener)

    // Push new one to list
    globalThis.window.__PSTL_HOOKS_CONTEXT_LISTENERS = [debouncedCb]

    return () => {
      globalThis.window?.removeEventListener('resize', debouncedCb as EventListener)
      globalThis.window.__PSTL_HOOKS_CONTEXT_LISTENERS?.pop()
    }
  }, [options?.debounceMs])

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
 * @description Listens to globalThis.window resize events and updates via CONTEXT. This requires you to FIRST place the PstlHooksProvider somewhere in your app ABOVE your intended use of this hook
 * @example
 // somewhere in app architecture
 // e.g render
  root.render(
    // Provider goes here, hook used in "App", below
    <PstlHooksProvider>
      <App />
    </PstlHooksProvider>
  )
 * @returns WindowSizes | undefined - width, height, and aspect ratio of globalThis.window (or undefined if not instantiated)
 */
export function useWindowSize(): WindowSizes | undefined {
  const windowSizeContext = useContext(WindowSizeContext)

  if (!windowSizeContext) {
    throw new Error(
      '[@past3lle/hooks::useWindowSize] - Missing top level PstlHooksProvider. You are attempting to use this hook outside of the provider. Hover over this function for example use-case.'
    )
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

export interface PstlHooksProviderOptions {
  windowSizes?: {
    debounceMs?: number
  }
}
/**
 * @name PstlHooksProvider
 * @description required to place ABOVE intended use of useWindowSize hook
 * @param providerOptions
 * @example
 // OPTIONS INTERFACE
 interface ProviderOptions {
    children?: ReactNode
    windowSizes?: {
      debounceMs?: number
    }
  }
  // EXAMPLE USE
  // somewhere in app architecture
  // e.g render
  root.render(
    // Provider goes here, hook used in "App", below
    <PstlHooksProvider>
      <App />
    </PstlHooksProvider>
  )
 * @returns
 */
export function PstlHooksProvider(props?: { children?: ReactNode; value?: WindowSizes } & PstlHooksProviderOptions) {
  const windowSizes = useWindowSizeSetup()
  return <WindowSizeContext.Provider value={props?.value || windowSizes}>{props?.children}</WindowSizeContext.Provider>
}
