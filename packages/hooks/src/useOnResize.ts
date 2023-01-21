import { useEffect } from 'react'

export function useOnResize(callback: (...params: any[]) => any, ...deps: any[]) {
  useEffect(() => {
    window.addEventListener('resize', callback)

    return () => {
      window.removeEventListener('resize', callback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...deps])
}
