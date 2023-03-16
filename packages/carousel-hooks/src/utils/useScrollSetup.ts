import { Dispatch, SetStateAction, useMemo, useRef, useState } from 'react'

import { AxisDirection, InfiniteScrollOptions, InifniteScrollDataParams, WheelGestureParams } from '../types'
import useScrollZoneRefs from './useScrollZoneRef'

interface InfiniteScrollSetup {
  gestureParams: InfiniteScrollOptions &
    Omit<InifniteScrollDataParams, 'dataLength'> &
    Pick<WheelGestureParams, 'prevRef'>
  currentIndex: number
  firstAnimationOver: boolean
  scrollingZoneTarget: HTMLElement | null
  callbacks: {
    setFirstPaintOver: Dispatch<SetStateAction<boolean>>
    setScrollingZoneRef: Dispatch<SetStateAction<HTMLElement>>
    setItemSizeRef: Dispatch<SetStateAction<number>>
  }
}

export default function useInfiniteScrollSetup(
  axisDirection: AxisDirection,
  options: InfiniteScrollOptions
): InfiniteScrollSetup {
  const [firstAnimationOver, setFirstPaintOver] = useState(false)

  const prevRef = useRef([0, 1])
  const [currentIndex, setCurrentIndex] = useState(prevRef.current[0])

  const {
    refs: { itemSize, scrollingZoneTarget },
    refCallbacks: { setItemSizeRef, setScrollingZoneRef }
  } = useScrollZoneRefs(axisDirection, options.sizeOptions)

  const gestureParams = useMemo(() => ({ ...options, prevRef, itemSize, setCurrentIndex }), [itemSize, options])

  return {
    gestureParams,
    currentIndex,
    firstAnimationOver,
    scrollingZoneTarget,
    callbacks: {
      setFirstPaintOver,
      setScrollingZoneRef,
      setItemSizeRef
    }
  }
}
