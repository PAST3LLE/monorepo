import { useLimitedHorizontalSwipe } from '@past3lle/carousel-hooks'
import React from 'react'

import { BaseCarouselProps, WithTouchAction } from '../types'
import AnimatedCarousel from './AnimatedCarousel'

export default function HorizontalSwipeCarousel({
  data,
  fixedSizes,
  sizeOptions,
  touchAction,
  ...rest
}: Omit<BaseCarouselProps, 'axis'> & WithTouchAction) {
  const animationProps = useLimitedHorizontalSwipe(data, {
    sizeOptions: { fixedSize: fixedSizes?.width, minSize: sizeOptions.minSize }
  })

  return (
    <AnimatedCarousel
      {...rest}
      axis="x"
      touchAction={touchAction}
      fixedSizes={fixedSizes}
      sizeOptions={sizeOptions}
      data={data}
      animationProps={animationProps}
    />
  )
}
