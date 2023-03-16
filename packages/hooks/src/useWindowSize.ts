import { useEffect, useState } from 'react'

const IS_CLIENT = window instanceof Window || typeof window === 'object'
let handler: (() => void) | undefined = undefined
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(_getSize)
  useEffect(() => {
    handler =
      handler ||
      function handleCheckWindowSize() {
        setWindowSize(_getSize())
      }

    if (handler && IS_CLIENT) {
      handler()
      window.addEventListener('resize', handler)
    }

    return () => {
      handler && window.removeEventListener('resize', handler)
      handler = undefined
    }
  }, [])

  return windowSize
}

function _getSize() {
  return {
    width: IS_CLIENT ? window.innerWidth : undefined,
    height: IS_CLIENT ? window.innerHeight : undefined,
    get ar() {
      if (!IS_CLIENT || !this.width || !this.height) return undefined
      return this.width / this.height
    }
  }
}
