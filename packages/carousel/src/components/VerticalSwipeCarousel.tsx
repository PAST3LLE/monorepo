import { InfiniteScrollOptions, useInfiniteVerticalScroll, useLimitedVerticalSwipe } from '@past3lle/carousel-hooks'
import { useIsMobile } from '@past3lle/hooks'
import React, { useMemo } from 'react'

import { BaseCarouselProps, WithTouchAction } from '../types'
import AnimatedCarousel from './AnimatedCarousel'

export default function VerticalSwipeCarousel({
  data,
  dimensions,
  touchAction,
  indicatorOptions,
  infiniteScrollOptions,
  ...rest
}: Omit<BaseCarouselProps<any[]>, 'axis'> & WithTouchAction & { infiniteScrollOptions: InfiniteScrollOptions }) {
  const mobileAnimationProps = useLimitedVerticalSwipe(data, {
    sizeOptions: { fixedSize: dimensions?.fixedSizes?.height, minSize: dimensions?.minSize }
  })

  const webAnimationProps = useInfiniteVerticalScroll(data, {
    sizeOptions: { fixedSize: dimensions?.fixedSizes?.height, minSize: dimensions?.minSize },
    ...infiniteScrollOptions
  })

  const isMobile = useIsMobile()
  const animationProps = useMemo(
    () => (isMobile ? mobileAnimationProps : webAnimationProps),
    [isMobile, mobileAnimationProps, webAnimationProps]
  )

  return (
    <AnimatedCarousel
      {...rest}
      data={data}
      axis="y"
      indicatorOptions={indicatorOptions}
      touchAction={touchAction}
      dimensions={dimensions}
      animationProps={animationProps}
    />
  )
}
