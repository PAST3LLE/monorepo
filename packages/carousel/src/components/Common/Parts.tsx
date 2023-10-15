import { AxisDirection } from '@past3lle/carousel-hooks'
import React, { useMemo } from 'react'
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
  position?: AbsolutePosition
  currentIndex: number
  barStyles?: string
}
export const CarouselIndicators = ({
  axis,
  size,
  accent = DEFAULT_CAROUSEL_ACCENT_COLOR,
  position = 'bottom',
  currentIndex,
  barStyles
}: CarouselIndicatorProps) => {
  if (size <= 1) return null

  const itemWidth = useMemo(() => Number((100 / size).toFixed(1)), [])

  return (
    <CarouselIndicatorWrapper axis={axis} position={position} css={barStyles}>
      {Array.from({ length: size }).map((_, index) => (
        <CarouselIndicator
          key={index}
          className={currentIndex === index ? 'active-indicator' : ''}
          isCurrent={currentIndex === index}
          color={accent}
          indicatorWidth={itemWidth}
        />
      ))}
    </CarouselIndicatorWrapper>
  )
}
