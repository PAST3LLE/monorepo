import { useCallback, useEffect, useState } from 'react'

const getIsVisibilityStateSupported = () => Boolean(typeof document !== undefined && 'visibilityState' in document)

function isWindowVisible() {
  return !getIsVisibilityStateSupported() || (typeof document !== undefined && document?.visibilityState !== 'hidden')
}

/**
 * Returns whether the window is currently visible to the user.
 */
export function useIsWindowVisible(): boolean {
  const [focused, setFocused] = useState<boolean>(isWindowVisible())
  const listener = useCallback(() => {
    setFocused(isWindowVisible())
  }, [setFocused])

  useEffect(() => {
    if (!getIsVisibilityStateSupported()) return undefined

    document.addEventListener('visibilitychange', listener)
    return () => {
      document.removeEventListener('visibilitychange', listener)
    }
  }, [listener])

  return focused
}
