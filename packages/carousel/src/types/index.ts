import { SizeOptions, SpringAnimationHookReturn } from '@past3lle/carousel-hooks'
import { AxisDirection } from '@past3lle/carousel-hooks'
import { SmartImageProps } from '@past3lle/components'
import { ForwardedRef } from 'react'
import { CarouselIndicatorProps } from 'src/components/Common'

import { CarouselSetup } from '../hooks'

export type TouchActionChoices =
  | 'auto'
  | 'none'
  | 'pan-x'
  | 'pan-left'
  | 'pan-right'
  | 'pan-y'
  | 'pan-up'
  | 'pan-down'
  | 'pinch-zoom'
  | 'manipulation'

export type TouchAction = TouchActionChoices[] | TouchActionChoices

export interface BaseCarouselProps {
  data: any[]
  axis: AxisDirection
  startIndex: number
  accentColor: string
  fixedSizes: { width: number; height: number } | undefined
  sizeOptions: SizeOptions
  transformation?: SmartImageProps['transformation']
  fullSizeContent?: boolean
  parentNode?: HTMLElement | null
  indicatorProps?: Pick<CarouselIndicatorProps, 'position' | 'zIndex'> & { showIndicators?: boolean }
  onCarouselItemClick?: () => void
  children: ({ index, defaultImageTransforms, isLast }: CarouselChildrenProps) => React.ReactNode
}

export interface BaseAnimatedCarouselProps extends BaseCarouselProps {
  animationProps: SpringAnimationHookReturn
  touchAction: TouchAction
}

export type WithTouchAction = {
  touchAction: TouchAction
}

export type CarouselChildrenProps = {
  index: number
  isLast: boolean
  forwardedRef?: ForwardedRef<unknown>
  defaultImageTransforms: CarouselSetup['imageTransformations']
}
