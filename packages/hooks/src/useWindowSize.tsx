import { MEDIA_WIDTHS, MediaWidths } from '@past3lle/theme'
import { devWarn } from '@past3lle/utils'
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

const IS_CLIENT = window instanceof Window || typeof window === 'object'
export function useWindowSizeSetup(options?: UseWindowSizeOptions) {
  const [windowSize, setWindowSize] = useState<WindowSizes>(_getSize)

  useEffect(() => {
    const debouncedCb = debounce(function handleCheckWindowSize() {
      setWindowSize(_getSize)
    }, options?.debounceMs || 150)

    if (IS_CLIENT) {
      window.addEventListener('resize', debouncedCb as EventListener)
    }

    return () => {
      window.removeEventListener('resize', debouncedCb as EventListener)
    }
  }, [options?.debounceMs])

  return windowSize
}

function _getSize(): WindowSizes {
  return {
    width: window?.innerWidth || document?.documentElement?.clientWidth || document?.body?.clientWidth,
    height: window?.innerHeight || document?.documentElement?.clientHeight || document?.body?.clientHeight,
    get ar() {
      if (!IS_CLIENT || !this.width || !this.height) return undefined
      return this.width / this.height
    }
  }
}

/**
 * @name useWindowSize
 * @description Listens to window resize events and updates via CONTEXT. This requires you to FIRST place the PstlHooksProvider somewhere in your app ABOVE your intended use of this hook
 * @example
 // somewhere in app architecture
 // e.g render
  root.render(
    // Provider goes here, hook used in "App", below
    <PstlHooksProvider>
      <App />
    </PstlHooksProvider>
  )
 * @returns void
 */
export function useWindowSize(): WindowSizes | undefined {
  const context = useContext(WindowSizeContext)

  const isInstantiated = !!context?.windowSizes
  if (!isInstantiated) {
    devWarn(
      '[@past3lle/hooks]::useWindowSize::Error! Cannot use <useWindowSize> hook outside of the PstlHooksProvider. Please add one to the root of your app, ABOVE where you are intending to use the hook. Hover over hook for example use-case. For now, calling window.clientWidth directly (not optimum).'
    )
  }

  return context?.windowSizes || _getSize()
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

/**
 * @name WindowSizeContext
 * @description Context for useWindowSize hook. Checks if existing Context exists, otherwise creates one
 * @example see useWindowSize
 * @returns void
 */
export const WindowSizeContext =
  window?.__PSTL_HOOKS_CONTEXT?.WindowSizeContext || React.createContext<{ windowSizes: WindowSizes } | null>(null)

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
export function PstlHooksProvider(props?: { children?: ReactNode } & PstlHooksProviderOptions) {
  const windowSizes = useWindowSizeSetup(props?.windowSizes)

  return <WindowSizeContext.Provider value={{ windowSizes }}>{props?.children}</WindowSizeContext.Provider>
}
