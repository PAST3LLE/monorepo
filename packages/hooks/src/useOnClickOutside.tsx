import { RefObject, useEffect, useRef } from 'react'

export function useOnClickOutside<T extends HTMLElement>(
  node: RefObject<T | undefined>,
  handler: undefined | (() => void),
  conditionalCb?: (target: Node) => boolean
) {
  const handlerRef = useRef<undefined | (() => void)>(handler)
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    if (typeof document === undefined) return
    const handleClickOutside = (e: MouseEvent) => {
      // If click target node is present in the ref, or if the conditional callback returns true, do nothing
      if ((node.current?.contains(e.target as Node) || conditionalCb?.(e.target as Node)) ?? false) {
        return
      }
      handlerRef.current?.()
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      typeof document !== undefined && document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [node, conditionalCb])
}
