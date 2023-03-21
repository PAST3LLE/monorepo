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
 * @description Listens to window resize events and updates via CONTEXT. This requires you to FIRST place the Past3lleHooksProvider somewhere in your app ABOVE your intended use of this hook
 * @example
 // somewhere in app architecture
 // e.g render
  root.render(
    // Provider goes here, hook used in "App", below
    <Past3lleHooksProvider>
      <App />
    </Past3lleHooksProvider>
  )
 * @returns void
 */
export function useWindowSize() {
  const context = useContext(WindowSizeContext)

  const isInstantiated = !!context?.windowSizes
  if (!isInstantiated) {
    throw new Error(
      '[@past3lle/hooks]::useWindowSize::Error! Cannot use <useWindowSize> hook outside of the Past3lleHooksProvider. Please add one to the root of your app, ABOVE where you are intending to use the hook. Hover over hook for example use-case.'
    )
  }

  return context?.windowSizes
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

export const WindowSizeContext = React.createContext<{ windowSizes: WindowSizes } | null>(null)

interface ProviderOptions {
  children?: ReactNode
  windowSizes?: {
    debounceMs?: number
  }
}
/**
 * @name Past3lleHooksProvider
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
    <Past3lleHooksProvider>
      <App />
    </Past3lleHooksProvider>
  )
 * @returns
 */
export function Past3lleHooksProvider(providerOptions?: ProviderOptions) {
  const windowSizes = useWindowSizeSetup(providerOptions?.windowSizes)

  return <WindowSizeContext.Provider value={{ windowSizes }}>{providerOptions?.children}</WindowSizeContext.Provider>
}
