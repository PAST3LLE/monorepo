import { useDrag } from '@use-gesture/react'
import { useSprings } from 'react-spring'

import { InfiniteScrollOptions, SpringAnimationHookReturn } from '../types'
import { runInfiniteScrollSprings } from '../utils'
import useInfiniteScrollSetup from '../utils/useScrollSetup'

const DRAG_SPEED_COEFFICIENT = 0.5

export default function useInfiniteHorizontalScroll(
  items: any[],
  options: InfiniteScrollOptions
): SpringAnimationHookReturn {
  const {
    gestureParams,
    currentIndex,
    firstAnimationOver,
    scrollingZoneTarget,
    callbacks: { setFirstPaintOver, ...restCbs }
  } = useInfiniteScrollSetup('x', options)

  const [springs, api] = useSprings(items.length, (i) => ({
    ...options?.styleMixin,
    x: (i < items.length - 1 ? i : -1) * gestureParams.itemSize,
    onRest() {
      if (!firstAnimationOver) {
        return setFirstPaintOver(true)
      }
    },
    from: {
      x: i * gestureParams.itemSize
    },
    config: {
      tension: 260,
      friction: 50
    }
  }))

  const bind = useDrag(
    ({ active, dragging, offset: [x], direction: [dx] }) => {
      runInfiniteScrollSprings(api, 'x', {
        ...gestureParams,
        dataLength: items.length,
        axis: -x / (options.scrollSpeed || DRAG_SPEED_COEFFICIENT),
        dAxis: -dx,
        active: !!(active || dragging),
        config: options.config
      })
    },
    {
      // target: scrollingZoneTarget,
      eventOptions: { passive: true, capture: false, once: true },
      preventDefault: true,
      axis: 'x',
      filterTaps: true
    }
  )

  return {
    target: scrollingZoneTarget,
    bind,
    springs,
    state: {
      currentIndex,
      itemSize: gestureParams.itemSize,
      firstAnimationOver
    },
    refCallbacks: restCbs
  }
}
