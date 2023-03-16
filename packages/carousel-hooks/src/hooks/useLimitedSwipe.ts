import { useDrag } from '@use-gesture/react'
import { useRef, useState } from 'react'
import { useSprings } from 'react-spring'

import { AxisDirection, OverwritingOptions, SpringAnimationHookReturn } from '../types'
import utils from '../utils'
import useScrollZoneRefs from '../utils/useScrollZoneRef'

export function useLimitedSwipe(
  axis: AxisDirection,
  data: any[],
  options?: OverwritingOptions
): SpringAnimationHookReturn {
  const {
    refs: { itemSize },
    refCallbacks
  } = useScrollZoneRefs(axis, options?.sizeOptions)

  const indexRef = useRef(0)
  const [indexState, setIndexState] = useState(indexRef.current)

  const [springs, api] = useSprings(
    data.length,
    (i) => ({
      ...options?.styleMixin,
      [axis]: i * itemSize,
      display: 'block'
    }),
    [itemSize]
  )

  const bind = useDrag(
    utils.drag.limited([, api], {
      axis,
      indexOptions: { current: indexRef, setIndex: setIndexState, last: data.length - 1 },
      itemSize
    }),
    { axis }
  )

  return {
    bind,
    springs,
    state: { currentIndex: indexState, itemSize },
    refCallbacks
  }
}

export function useLimitedHorizontalSwipe(data: any[], options?: OverwritingOptions): SpringAnimationHookReturn {
  return useLimitedSwipe('x', data, options)
}

export function useLimitedVerticalSwipe(data: any[], options?: OverwritingOptions): SpringAnimationHookReturn {
  return useLimitedSwipe('y', data, options)
}
