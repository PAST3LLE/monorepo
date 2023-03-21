import { useEffect } from 'react'

import { useWindowSize } from './useWindowSize'

export function useOnResize(callback: (...params: any[]) => any, ...deps: any[]) {
  const windowSizes = useWindowSize()
  useEffect(() => {
    callback()
  }, [callback, windowSizes, ...deps])
}
