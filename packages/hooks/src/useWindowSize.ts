import { MEDIA_WIDTHS, MediaWidths } from '@past3lle/theme'
import { isMobile } from '@past3lle/utils'
import { useEffect, useState } from 'react'

interface WindowSize {
  width: number | undefined
  height: number | undefined
  ar: number | undefined
}

interface SpecificEvent<E extends EventTarget> extends Event {
  target: E
}

const IS_CLIENT = window instanceof Window || typeof window === 'object'
let handler: ((e: SpecificEvent<Window>) => void) | undefined = undefined
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
    ar: undefined
  })
  useEffect(() => {
    handler =
      handler ||
      function handleCheckWindowSize(e: SpecificEvent<Window>) {
        console.debug('EVENT', e)
        setWindowSize(_getSize(e))
      }

    if (handler && IS_CLIENT) {
      handler({ target: { innerHeight: window.innerHeight, innerWidth: window.innerWidth } } as SpecificEvent<Window>)
      window.addEventListener('resize', handler as EventListener)
    }

    return () => {
      handler && window.removeEventListener('resize', handler as EventListener)
      handler = undefined
    }
  }, [])

  return windowSize
}

function _getSize(e: SpecificEvent<Window>): WindowSize {
  return {
    width: e.target?.innerWidth,
    height: e.target?.innerHeight,
    get ar() {
      if (!IS_CLIENT || !this.width || !this.height) return undefined
      return this.width / this.height
    }
  }
}

export function useWindowSmallerThan(media: MediaWidths) {
  const sizes = useWindowSize()

  return Boolean(sizes?.width && sizes.width <= media)
}

export const useIsExtraSmallMediaWidth = () => useWindowSmallerThan(MEDIA_WIDTHS.upToExtraSmall)
export const useIsSmallMediaWidth = () => useWindowSmallerThan(MEDIA_WIDTHS.upToSmall)
export const useIsMediumMediaWidth = () => useWindowSmallerThan(MEDIA_WIDTHS.upToMedium)
export const useIsLargeMediaWidth = () => useWindowSmallerThan(MEDIA_WIDTHS.upToLarge)
export const useIsExtraLargeMediaWidth = () => useWindowSmallerThan(MEDIA_WIDTHS.upToExtraLarge)

export function useIsMobile() {
  const isMobileWidth = useIsSmallMediaWidth()

  return isMobile || isMobileWidth
}
