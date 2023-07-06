import { devDebug } from '@past3lle/utils'
import { useEffect } from 'react'

/**
 * @name useOnKeyPress
 * @param key Array! of keys to listen for. If just one key do: [key]
 * @param handler any handler function to call on event key
 * @example
 * useOnKeyPress(['Esc', 'Escape'], (event) => console.log(event))
 */
export function useOnKeyPress(key: KeyboardEvent['key'][], handler: (...params: any[]) => void) {
  useEffect(() => {
    if (typeof document !== undefined) return
    const listener = function listener(event: KeyboardEvent) {
      if (key.some((key) => key === event.key)) {
        devDebug('[@past3lle/hooks]::useOnKeyPress::Firing handler!', event.key)
        handler()
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      typeof document !== undefined && document.removeEventListener('keydown', listener)
    }
  }, [handler, key])
}
