import { MEDIA_WIDTHS, MediaWidths } from '@past3lle/theme'
import { devDebug, devWarn } from '@past3lle/utils'
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

const checkWindow = () => typeof global?.window !== undefined

export function useWindowSizeSetup(options?: UseWindowSizeOptions) {
  const [windowSize, setWindowSize] = useState<WindowSizes>()

  useEffect(() => {
    if (!checkWindow()) return

    const debouncedCb = debounce(function handleCheckWindowSize() {
      setWindowSize(_getSize)
    }, options?.debounceMs || 150)

    global.window.addEventListener('resize', debouncedCb as EventListener)

    return () => {
      global.window?.removeEventListener('resize', debouncedCb as EventListener)
    }
  }, [options?.debounceMs])

  return windowSize
}

function _getSize(): WindowSizes {
  return {
    width:
      global?.window?.innerWidth ||
      global?.window?.document?.documentElement?.clientWidth ||
      global?.window?.document?.body?.clientWidth,
    height:
      global?.window?.innerHeight ||
      global?.window?.document?.documentElement?.clientHeight ||
      global?.window?.document?.body?.clientHeight,
    get ar() {
      if (!checkWindow() || !this.width || !this.height) return undefined
      // round the number to 2 decimal places
      return Math.round((this.width / (this.height + Number.EPSILON)) * 100) / 100
    }
  }
}

const nullContext = React.createContext(null)
/**
 * @name useWindowSize
 * @description Listens to global.window resize events and updates via CONTEXT. This requires you to FIRST place the PstlHooksProvider somewhere in your app ABOVE your intended use of this hook
 * @example
 // somewhere in app architecture
 // e.g render
  root.render(
    // Provider goes here, hook used in "App", below
    <PstlHooksProvider>
      <App />
    </PstlHooksProvider>
  )
 * @returns WindowSizes | undefined - width, height, and aspect ratio of global.window (or undefined if not instantiated)
 */
export function useWindowSize(): WindowSizes | undefined {
  const [context, setContext] = useState<React.Context<{ windowSizes: WindowSizes }>>(nullContext as any)
  useEffect(() => {
    if (checkWindow()) {
      if (!global.window?.__PSTL_HOOKS_CONTEXT?.WindowSizeContext) {
        devWarn(
          '[@past3lle/hooks]::useWindowSize::Warning! Cannot use <useWindowSize> hook outside of the PstlHooksProvider. Please add one to the root of your app, ABOVE where you are intending to use the hook. Hover over hook for example use-case. For now, calling global.window.clientWidth directly (not optimum).'
        )
      } else {
        setContext(global.window?.__PSTL_HOOKS_CONTEXT?.WindowSizeContext || nullContext)
      }
    }
  }, [])

  const ctxt = useContext(context)

  return ctxt?.windowSizes || checkWindow() ? _getSize() : undefined
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

const WindowSizeContext = React.createContext<{ windowSizes: WindowSizes } | null>(null)
/**
 * @name checkAndSetContextProvider
 * @description Context for useWindowSize hook. Checks if existing Context exists, otherwise creates one
 * @example see useWindowSize
 * @returns Context for useWindowSize hook (or undefined if already instantiated) - width, height, and aspect ratio of global.window
 */
export const checkAndSetContextProvider = () => {
  if (checkWindow() && !global.window?.__PSTL_HOOKS_CONTEXT?.WindowSizeContext) {
    global.window.__PSTL_HOOKS_CONTEXT = { WindowSizeContext }
  }
}

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
  const windowSizes = useWindowSizeSetup(props?.windowSizes) || { width: undefined, height: undefined, ar: undefined }

  useEffect(checkAndSetContextProvider, [])

  const [Context, setContext] = useState<
    React.Context<{
      windowSizes: WindowSizes
    } | null>
  >(WindowSizeContext)
  useEffect(() => {
    // No global.window instance, bail
    if (!checkWindow()) return
    // Check if context already exists, if not, create one
    else if (!global.window?.__PSTL_HOOKS_CONTEXT?.WindowSizeContext?.Provider) {
      devDebug('[@past3lle/hooks]::PstlHooksProvider::Context does not exist, creating new context')
      setContext(WindowSizeContext)
    } else {
      const ContextProvider = global.window?.__PSTL_HOOKS_CONTEXT.WindowSizeContext
      devDebug('[@past3lle/hooks]::PstlHooksProvider::Context already exists, skipping creation')
      setContext(ContextProvider)
    }
  }, [])

  return <Context.Provider value={{ windowSizes }}>{props?.children}</Context.Provider>
}
