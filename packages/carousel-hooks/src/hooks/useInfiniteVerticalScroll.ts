import { useIsMobile } from '@past3lle/hooks'
import { useGesture } from '@use-gesture/react'
import { useRef } from 'react'
import { useSprings } from 'react-spring'

import { STIFF_SPRINGS } from '../constants/springs'
import { InfiniteScrollOptions, SpringAnimationHookReturn } from '../types'
import utils, { runInfiniteScrollSprings } from '../utils'
import useInfiniteScrollSetup from '../utils/useScrollSetup'

const CONFIG = {
  SCROLL_SPEED_COEFFICIENT: 3.2,
  DRAG_SPEED_COEFFICIENT: 0.5
}
// const MAC_SPRING_CONFIG: SpringConfig = { friction: 90, tension: 280 }
// const MOBILE_SPRING_CONFIG: SpringConfig = { friction: 20, tension: 50, mass: 1 }

export default function useInfiniteVerticalScroll(
  items: any[],
  options: InfiniteScrollOptions
): SpringAnimationHookReturn {
  const isMobile = useIsMobile()
  const {
    gestureParams,
    currentIndex,
    firstAnimationOver,
    callbacks: { setFirstPaintOver, ...restCbs }
  } = useInfiniteScrollSetup('y', options)

  const lastIndex = items.length - 1

  const gestureApi = useSprings(
    items.length,
    (i) => ({
      ...options?.styleMixin,
      scale: options.scaleOptions.initialScale || 0.92,
      y: (i < lastIndex ? i : -1) * gestureParams.itemSize,
      onRest: () => {
        // useful in knowing when the FIRST animation has ended
        // like for setup
        if (!firstAnimationOver) {
          setFirstPaintOver(true)
        }
      },
      config: STIFF_SPRINGS
    }),
    [gestureParams.itemSize]
  )

  const wheelOffset = useRef(0)
  const dragOffset = useRef(0)

  const dragIndexRef = useRef(0)

  const bind = useGesture(
    {
      onDrag: utils.drag.limited(gestureApi, {
        axis: 'y',
        itemSize: gestureParams.itemSize,
        indexOptions: { current: dragIndexRef, setIndex: undefined, last: lastIndex }
      }),
      onWheel: ({ active, last, offset: [, y], movement: [, my], direction: [, dy] }) => {
        if (dy) {
          wheelOffset.current = y
          const computedY = dragOffset.current + y / CONFIG.SCROLL_SPEED_COEFFICIENT
          runInfiniteScrollSprings(gestureApi[1], 'y', {
            ...gestureParams,
            dataLength: items.length,
            active,
            axis: computedY,
            dAxis: dy,
            mAxis: my,
            last
          })
        }
      }
    },
    {
      drag: {
        axis: 'y',
        preventScrollAxis: 'x'
      }
    }
  )

  return {
    bind,
    springs: gestureApi[0],
    state: {
      // TODO: check we want this
      currentIndex: isMobile ? 0 : currentIndex,
      itemSize: gestureParams.itemSize,
      firstAnimationOver
    },
    refCallbacks: restCbs
  }
}
