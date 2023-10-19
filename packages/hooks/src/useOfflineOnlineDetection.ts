import { useEffect } from 'react'

interface Params {
  handleOnline: (...params: any[]) => void
  handleOffline: (...params: any[]) => void
}
export function useOfflineOnlineDetection({ handleOnline, handleOffline }: Params) {
  useEffect(() => {
    if (typeof globalThis?.window === 'undefined') return

    // Init event listener
    globalThis.window.addEventListener('offline', handleOffline)
    globalThis.window.addEventListener('online', handleOnline)

    return () => {
      globalThis?.window.removeEventListener('offline', handleOffline)
      globalThis?.window.removeEventListener('online', handleOnline)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
