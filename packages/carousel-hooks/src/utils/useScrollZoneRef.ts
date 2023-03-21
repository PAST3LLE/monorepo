import { useStateRef, useWindowSize } from '@past3lle/hooks'
import { devWarn } from '@past3lle/utils'
import { useEffect } from 'react'

import { SizeOptions } from '../types'

export default function useScrollZoneRefs(axisDirection: 'x' | 'y', sizeOptions?: SizeOptions) {
  if (sizeOptions?.minSize === 0)
    devWarn(
      '[ScrollRef] Setup warning! Size 0 (ZERO) minSize passed. This could cause layout issues! Check the options object passed to your useScroll animation hooks.'
    )
  const windowSizes = useWindowSize()
  const [scrollingZoneTarget, setScrollingZoneRef] = useStateRef<HTMLElement | null>(null, (node) => node)
  // width or height
  const isVertical = axisDirection === 'y'
  const [nodeSize, setItemSizeRef] = useStateRef<number>(
    0,
    // node width or height
    (node) => (isVertical ? node?.clientHeight : node?.clientWidth)
  )

  const itemSize =
    sizeOptions?.fixedSize || (sizeOptions?.minSize && Math.min(sizeOptions.minSize, nodeSize)) || nodeSize

  useEffect(() => {
    const handler = (e: any) => e.preventDefault()

    scrollingZoneTarget?.addEventListener('gesturestart', handler)
    scrollingZoneTarget?.addEventListener('gesturechange', handler)
    scrollingZoneTarget?.addEventListener('gestureend', handler)

    return () => {
      scrollingZoneTarget?.removeEventListener('gesturestart', handler)
      scrollingZoneTarget?.removeEventListener('gesturechange', handler)
      scrollingZoneTarget?.removeEventListener('gestureend', handler)
    }
  }, [scrollingZoneTarget])

  useEffect(() => {
    // width or height
    if (
      !sizeOptions?.fixedSize &&
      (isVertical ? scrollingZoneTarget?.clientHeight : scrollingZoneTarget?.clientWidth)
    ) {
      setItemSizeRef(scrollingZoneTarget)
    }
  }, [sizeOptions, setItemSizeRef, windowSizes, scrollingZoneTarget, axisDirection, isVertical])

  return { refs: { scrollingZoneTarget, itemSize }, refCallbacks: { setScrollingZoneRef, setItemSizeRef } }
}
