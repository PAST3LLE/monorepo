import { useLimitedHorizontalSwipe } from '@past3lle/carousel-hooks'
import React from 'react'

import { BaseCarouselProps, WithTouchAction } from '../types'
import AnimatedCarousel from './AnimatedCarousel'

export default function HorizontalSwipeCarousel<D extends any[]>({
  data,
  dimensions,
  touchAction,
  ...rest
}: BaseCarouselProps<D> & WithTouchAction) {
  const animationProps = useLimitedHorizontalSwipe(data, {
    sizeOptions: {
      fixedSize: dimensions?.fixedSizes?.width,
      minSize: dimensions?.minSize
    }
  })

  return (
    <AnimatedCarousel
      {...rest}
      data={data}
      dimensions={dimensions}
      animationProps={animationProps}
      touchAction={touchAction}
    />
  )
}
