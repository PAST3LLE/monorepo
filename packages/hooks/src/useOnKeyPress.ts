import { devDebug } from '@past3lle/utils'
import { useEffect } from 'react'

/**
 * @name useOnKeyPress
 * @param key Array! of keys to listen for. If just one key do: [key]
 * @param handler any handler function to call on event key
 * @example
 * useOnKeyPress(['Esc', 'Escape'], (event) => console.log(event))
 */
export function useOnKeyPress(keys: KeyboardEvent['key'][], handler: (...params: any[]) => void) {
  useEffect(() => {
    if (typeof globalThis?.window?.document === 'undefined' || keys.length < 1) return

    const listener = function listener(event: KeyboardEvent) {
      if (keys.some((key) => key === event.key)) {
        devDebug('[@past3lle/hooks]::useOnKeyPress::Firing handler!', event.key)
        handler()
      }
    }
    globalThis.window.document.addEventListener('keydown', listener)
    return () => {
      if (typeof globalThis?.window?.document === 'undefined') return
      globalThis.window.document.removeEventListener('keydown', listener)
    }
  }, [handler, keys])
}
