import { AxisDirection } from '@past3lle/carousel-hooks'
import { OFF_WHITE } from '@past3lle/theme'
import React from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'

import { BaseCarouselProps } from '../../types'
import {
  AbsolutePosition,
  CarouselButton,
  CarouselButtonContainer,
  CarouselIndicator,
  CarouselIndicatorWrapper,
  StaticCarouselStep
} from '../Common/styleds'

export type CarouselStepsProps = Pick<BaseCarouselProps, 'accentColor' | 'onCarouselItemClick'> & {
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

export function CarouselStep(props: CarouselStepsProps) {
  const {
    children,
    index,
    accentColor,
    transformAmount,
    parentWidth,
    showButtons,
    isMultipleCarousel,
    onCarouselItemClick,
    onNext,
    onPrev
  } = props

  return (
    <StaticCarouselStep
      id={'carousel-step-' + index}
      justifyContent="center"
      $transformAmount={transformAmount}
      $width={parentWidth}
    >
      {children}
      {showButtons && isMultipleCarousel && (
        <CarouselButtonContainer onClick={onCarouselItemClick}>
          <CarouselButton onClick={onPrev ?? undefined} buttonColor={accentColor}>
            <ChevronLeft />
          </CarouselButton>
          <CarouselButton onClick={onNext ?? undefined} buttonColor={accentColor}>
            <ChevronRight />
          </CarouselButton>
        </CarouselButtonContainer>
      )}
    </StaticCarouselStep>
  )
}

export interface CarouselIndicatorProps {
  size: number
  axis: AxisDirection
  color?: string
  zIndex?: number
  position?: AbsolutePosition
  currentIndex: number
}

export const CarouselIndicators = ({
  color,
  currentIndex,
  size,
  zIndex = 900,
  axis,
  position = 'bottom-right'
}: CarouselIndicatorProps) => {
  if (size <= 1) return null

  return (
    <CarouselIndicatorWrapper axis={axis} zIndex={zIndex} position={position}>
      {Array.from({ length: size }).map((_, index) => (
        <CarouselIndicator key={index} isCurrent={currentIndex === index} color={OFF_WHITE || color}>
          {index + 1}
        </CarouselIndicator>
      ))}
    </CarouselIndicatorWrapper>
  )
}
