import { useEffect, useState } from 'react'

const IS_CLIENT = window instanceof Window || typeof window === 'object'
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(_getSize)
  useEffect(() => {
    function handleCheckWindowSize() {
      setWindowSize(_getSize())
    }
    // initial call
    handleCheckWindowSize()
    if (IS_CLIENT) {
      window.addEventListener('resize', handleCheckWindowSize)
      return () => {
        window.removeEventListener('resize', handleCheckWindowSize)
      }
    }
    return undefined
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
