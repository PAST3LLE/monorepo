import { setForwardedRef } from '@past3lle/utils'
import React from 'react'
import { ForwardedRef, forwardRef, useMemo, useState } from 'react'

import { useCarouselSetup } from '../hooks'
import { BaseCarouselProps } from '../types'
import { CarouselContainer, CarouselStep } from './Common'

export interface ButtonCarouselProps extends BaseCarouselProps {
  showButtons?: boolean
  forwardedRef?: ForwardedRef<HTMLDivElement>
  onCarouselChange?: (index: number) => void
}

export default function ButtonCarousel({
  data,
  startIndex,
  fixedSizes,
  forwardedRef,
  onCarouselChange,
  children,
  ...rest
}: ButtonCarouselProps) {
  const [selectedStep, setSelectedStep] = useState(startIndex)
  const {
    parentWidth,
    imageTransformations: defaultImageTransforms,
    setCarouselContainerRef
  } = useCarouselSetup({
    fixedSizes
  })

  const { isMultipleCarousel, lastStepIndex } = useMemo(
    () => ({
      isMultipleCarousel: data.length > 1,
      lastStepIndex: data.length - 1
    }),
    [data.length]
  )

  return (
    <CarouselContainer
      $touchAction={'auto'}
      id="#carousel-container"
      ref={(node) => {
        setCarouselContainerRef(node)
        node && forwardedRef && setForwardedRef(node, forwardedRef)
      }}
      $fixedHeight={(fixedSizes?.height || parentWidth) + 'px'}
    >
      {/* CAROUSEL CONTENT */}
      {data.map((_, index) => {
        if (!parentWidth) return null
        const isCurrentStep = !isMultipleCarousel || index === selectedStep
        // has multiple steps and is on last item
        const isLastStep = isMultipleCarousel && selectedStep === lastStepIndex
        const calculatedWidth = isCurrentStep ? 0 : parentWidth

        const onNext = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.stopPropagation()
          let indexToSet = undefined
          if (isLastStep) {
            indexToSet = 0
          } else {
            indexToSet = selectedStep + 1
          }
          // change carousel slide
          setSelectedStep(indexToSet)
          // side effect change item video
          onCarouselChange && onCarouselChange(indexToSet)
        }

        const onPrevious = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.stopPropagation()
          let indexToSet = undefined
          if (selectedStep === 0) {
            indexToSet = lastStepIndex
          } else {
            indexToSet = selectedStep - 1
          }
          // change carousel slide
          setSelectedStep(indexToSet)
          // side effect change item video
          onCarouselChange && onCarouselChange(indexToSet)
        }

        return (
          <CarouselStep
            {...rest}
            key={index}
            index={index}
            transformAmount={calculatedWidth}
            parentWidth={parentWidth}
            isMultipleCarousel={!!data.length}
            onPrev={onPrevious}
            onNext={onNext}
          >
            {children({ index, defaultImageTransforms, isLast: index === length - 1 })}
          </CarouselStep>
        )
      })}
    </CarouselContainer>
  )
}

export const ButtonCarouselWithRef = forwardRef(function ButtonCarouselWithRef(props: any, ref) {
  return <ButtonCarousel {...props} forwardedRef={ref} />
})
