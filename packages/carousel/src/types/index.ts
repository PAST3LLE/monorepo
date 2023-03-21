import { SpringAnimationHookReturn } from '@past3lle/carousel-hooks'
import { AxisDirection } from '@past3lle/carousel-hooks'
import { SmartImageProps } from '@past3lle/components'
import { ForwardedRef } from 'react'

import type { ButtonCarouselProps } from '../components/ButtonCarousel'
import { CarouselIndicatorProps } from '../components/Common'
import { CarouselSetup } from '../hooks'

export { ButtonCarouselProps }
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

export interface OptionalCarouselProps {
  parentNode?: HTMLElement | null
  onCarouselItemClick?: () => void
  colors?: {
    accent?: string
    background?: string
  }
  dimensions?: {
    minSize?: number
    fixedSizes?: { width: number; height: number } | undefined
    fillContainer?: boolean
    fullSizeContent?: boolean
  }
  imageKit?: {
    transformation?: SmartImageProps['transformation']
  }
  indicatorOptions?: Pick<CarouselIndicatorProps, 'position' | 'zIndex'> & { showIndicators?: boolean }
}
export interface BaseCarouselProps<T extends any[]> extends OptionalCarouselProps {
  data: T
  axis: AxisDirection
  startIndex: number
  children: ({ index, defaultImageTransforms, isLast }: CarouselChildrenProps) => React.ReactNode
}

export type WithTouchAction = {
  touchAction: TouchAction
}

export interface BaseAnimatedCarouselProps<T extends any[]> extends BaseCarouselProps<T>, WithTouchAction {
  animationProps: SpringAnimationHookReturn
}

export type CarouselChildrenProps = {
  index: number
  isLast: boolean
  forwardedRef?: ForwardedRef<unknown>
  defaultImageTransforms: CarouselSetup['imageTransformations']
}
