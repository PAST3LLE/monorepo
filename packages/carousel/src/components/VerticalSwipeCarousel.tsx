import { useInfiniteVerticalScroll, useLimitedVerticalSwipe } from '@past3lle/carousel-hooks'
import { InfiniteScrollOptions } from '@past3lle/carousel-hooks/src/types'
import { isMobile } from '@past3lle/utils'
import React from 'react'

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
    sizeOptions: { fixedSize: dimensions?.fixedSizes?.height, minSize: dimensions?.placeholderSize }
  })

  const webAnimationProps = useInfiniteVerticalScroll(data, {
    sizeOptions: { fixedSize: dimensions?.fixedSizes?.height, minSize: dimensions?.placeholderSize },
    ...infiniteScrollOptions
  })

  return (
    <AnimatedCarousel
      {...rest}
      data={data}
      axis="y"
      indicatorOptions={indicatorOptions}
      touchAction={touchAction}
      dimensions={dimensions}
      animationProps={isMobile ? mobileAnimationProps : webAnimationProps}
    />
  )
}
