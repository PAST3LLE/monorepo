import { useCallback, useState } from 'react'

/**
 * Forces a re-render, similar to `forceUpdate` in class components.
 */
export function useForceUpdate() {
  const [, dispatch] = useState<Record<any, any>>(Object.create(null))
  return useCallback(() => {
    dispatch(Object.create(null))
  }, [])
}
