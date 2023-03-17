import { AxisDirection } from '@past3lle/carousel-hooks'
import React from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'

import { DEFAULT_CAROUSEL_ACCENT_COLOR } from '../../constants/config'
import { BaseCarouselProps } from '../../types'
import {
  AbsolutePosition,
  CarouselButton,
  CarouselButtonContainer,
  CarouselIndicator,
  CarouselIndicatorWrapper,
  CarouselItemContainer
} from '../Common/styleds'

export type CarouselStepsProps = Pick<BaseCarouselProps<any[]>, 'colors' | 'onCarouselItemClick'> & {
  children: React.ReactNode
  index: number
  parentWidth: number
  transformAmount: number

  showButtons?: boolean
  showIndicators?: boolean

  isMultipleCarousel?: boolean
  onNext?: ((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | null
  onPrev?: ((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | null
}

export function CarouselItem(props: CarouselStepsProps) {
  const {
    children,
    index,
    colors,
    transformAmount,
    parentWidth,
    showButtons,
    isMultipleCarousel,
    onCarouselItemClick,
    onNext,
    onPrev
  } = props

  return (
    <CarouselItemContainer
      id={'carousel-step-' + index}
      justifyContent="center"
      backgroundColor={colors?.background || 'transparent'}
      $transformAmount={transformAmount}
      $width={parentWidth}
    >
      {children}
      {showButtons && isMultipleCarousel && (
        <CarouselButtonContainer onClick={onCarouselItemClick}>
          <CarouselButton onClick={onPrev ?? undefined} buttonColor={colors?.accent || DEFAULT_CAROUSEL_ACCENT_COLOR}>
            <ChevronLeft />
          </CarouselButton>
          <CarouselButton onClick={onNext ?? undefined} buttonColor={colors?.accent || DEFAULT_CAROUSEL_ACCENT_COLOR}>
            <ChevronRight />
          </CarouselButton>
        </CarouselButtonContainer>
      )}
    </CarouselItemContainer>
  )
}

export interface CarouselIndicatorProps {
  size: number
  axis: AxisDirection
  accent?: string
  zIndex?: number
  position?: AbsolutePosition
  currentIndex: number
}
export const CarouselIndicators = ({
  axis,
  size,
  zIndex = 900,
  accent = DEFAULT_CAROUSEL_ACCENT_COLOR,
  position = 'bottom-right',
  currentIndex
}: CarouselIndicatorProps) => {
  if (size <= 1) return null

  return (
    <CarouselIndicatorWrapper axis={axis} zIndex={zIndex} position={position}>
      {Array.from({ length: size }).map((_, index) => (
        <CarouselIndicator key={index} isCurrent={currentIndex === index} color={accent}>
          {index + 1}
        </CarouselIndicator>
      ))}
    </CarouselIndicatorWrapper>
  )
}
