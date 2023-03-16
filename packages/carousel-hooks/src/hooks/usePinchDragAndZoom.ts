import { useGesture } from '@use-gesture/react'
import { useSprings } from 'react-spring'

import { OverwritingOptions, SpringAnimationHookReturn } from '../types'
import utils from '../utils'
import useScrollZoneRefs from '../utils/useScrollZoneRef'

export function usePinchZoomAndDrag(data: any[], options?: OverwritingOptions): SpringAnimationHookReturn {
  const {
    refs: { itemSize, scrollingZoneTarget: ref },
    refCallbacks
  } = useScrollZoneRefs('x', options?.sizeOptions)

  const [springs, api] = useSprings(
    data.length,
    (i) => ({
      ...options?.styleMixin,
      x: i * itemSize,
      y: 0,
      scale: 1,
      display: 'block'
    }),
    [data.length]
  )

  const bind = useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) return cancel()
        api.start({ x, y })
      },
      onPinch: utils.pinch.zoom([springs, api], { ref })
    },
    {
      drag: { from: () => [springs[0].x.get(), springs[0].y.get()], bound: ref?.getBoundingClientRect() },
      pinch: { scaleBounds: { min: 0.8, max: 3 }, rubberband: true }
    }
  )

  return {
    bind,
    springs,
    state: { currentIndex: 0, itemSize },
    refCallbacks
  }
}
