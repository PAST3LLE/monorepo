import { useEffect } from 'react'

import { useWindowSize } from './useWindowSize'

/**
 * @name useOnResize
 * @description Detects window re-sizing and calls a passed in callback based on a condition, if required.
 * @example
  // close open nav on window resize
  useOnResize(() => setIsNavOpen(false), isNavOpen)
 * @param callback function to call on window resize. If condition param is given, only fires when true
 * @param condition [optional] condition necessary to be true before firing callback. Defaults to <true>
 */
export function useOnResize(callback: (...params: any[]) => any, condition = true) {
  const windowSizes = useWindowSize()
  useEffect(() => {
    if (condition) {
      callback()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowSizes])
}
