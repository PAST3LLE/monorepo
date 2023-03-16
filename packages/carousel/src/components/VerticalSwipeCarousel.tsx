import { useInfiniteVerticalScroll, useLimitedVerticalSwipe } from '@past3lle/carousel-hooks'
import { InfiniteScrollOptions } from '@past3lle/carousel-hooks/src/types'
import { isMobile } from '@past3lle/utils'
import React from 'react'

import { BaseCarouselProps, WithTouchAction } from '../types'
import AnimatedCarousel from './AnimatedCarousel'

export default function VerticalSwipeCarousel({
  data,
  fixedSizes,
  sizeOptions,
  infiniteScrollOptions,
  touchAction,
  indicatorProps,
  ...rest
}: Omit<BaseCarouselProps, 'axis'> & WithTouchAction & { infiniteScrollOptions: InfiniteScrollOptions }) {
  const mobileAnimationProps = useLimitedVerticalSwipe(data, {
    sizeOptions: { fixedSize: fixedSizes?.height, minSize: sizeOptions.minSize }
  })

  const webAnimationProps = useInfiniteVerticalScroll(data, {
    sizeOptions: { fixedSize: fixedSizes?.height, minSize: sizeOptions.minSize },
    ...infiniteScrollOptions
  })

  return (
    <AnimatedCarousel
      {...rest}
      axis="y"
      indicatorProps={indicatorProps}
      touchAction={touchAction}
      fixedSizes={fixedSizes}
      sizeOptions={sizeOptions}
      data={data}
      animationProps={isMobile ? mobileAnimationProps : webAnimationProps}
    />
  )
}
