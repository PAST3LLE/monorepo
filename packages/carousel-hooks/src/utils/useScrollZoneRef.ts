import { useStateRef, useWindowSize } from '@past3lle/hooks'
import { devWarn } from '@past3lle/utils'
import { useEffect } from 'react'

import { SizeOptions } from '../types'

export default function useScrollZoneRefs(axisDirection: 'x' | 'y', sizeOptions?: SizeOptions) {
  if (!sizeOptions?.minSize)
    devWarn(
      '[ScrollRef] Setup warning! Size 0 (ZERO) minSize passed. This could cause layout issues! Check the options object passed to your useScroll animation hooks.'
    )
  const { ar } = useWindowSize()
  const [scrollingZoneTarget, setScrollingZoneRef] = useStateRef<HTMLElement | null>(null, (node) => node)
  // width or height
  const isVertical = axisDirection === 'y'
  const [itemSize, setItemSizeRef] = useStateRef<number>(
    0,
    // width or height
    (node) =>
      sizeOptions?.fixedSize || Math.min(isVertical ? node?.clientHeight : node?.clientWidth, sizeOptions?.minSize || 0)
  )

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
  }, [sizeOptions, setItemSizeRef, ar, scrollingZoneTarget, axisDirection, isVertical])

  return { refs: { scrollingZoneTarget, itemSize }, refCallbacks: { setScrollingZoneRef, setItemSizeRef } }
}
