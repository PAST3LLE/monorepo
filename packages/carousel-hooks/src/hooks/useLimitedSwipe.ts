import { useSprings } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { useRef, useState } from 'react'

import { AxisDirection, OverwritingOptions, SpringAnimationHookReturn, WithWindowSizeOptions } from '../types'
import utils from '../utils'
import useScrollZoneRefs from '../utils/useScrollZoneRef'

export function useLimitedSwipe<A extends any[]>(
  axis: AxisDirection,
  data: A,
  options?: OverwritingOptions,
  auxOptions?: WithWindowSizeOptions
): SpringAnimationHookReturn {
  const {
    refs: { itemSize },
    refCallbacks
  } = useScrollZoneRefs(axis, options?.sizeOptions, auxOptions)

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

export function useLimitedHorizontalSwipe<A extends any[]>(
  data: A,
  options?: OverwritingOptions,
  auxOptions?: WithWindowSizeOptions
): SpringAnimationHookReturn {
  return useLimitedSwipe('x', data, options, auxOptions)
}

export function useLimitedVerticalSwipe<A extends any[]>(
  data: A,
  options?: OverwritingOptions,
  auxOptions?: WithWindowSizeOptions
): SpringAnimationHookReturn {
  return useLimitedSwipe('y', data, options, auxOptions)
}
