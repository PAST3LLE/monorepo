import React from 'react'

import { useCarouselSetup } from '../hooks'
import { BaseAnimatedCarouselProps } from '../types'
import { AnimatedDivContainer, CarouselContainer, CarouselIndicators, CarouselStep } from './Common'

export default function AnimatedCarousel({
  data,
  axis,
  fixedSizes,
  accentColor,
  touchAction,
  animationProps,
  indicatorProps = { showIndicators: true },
  children
}: BaseAnimatedCarouselProps) {
  const {
    parentSizes,
    imageTransformations: defaultImageTransforms,
    setCarouselContainerRef
  } = useCarouselSetup({
    fixedSizes
  })

  const {
    bind,
    springs,
    state: { currentIndex, itemSize },
    refCallbacks: { setItemSizeRef, setScrollingZoneRef }
  } = animationProps

  return (
    <CarouselContainer
      id="#carousel-container"
      ref={(node) => {
        setCarouselContainerRef(node)
        setItemSizeRef(node)
      }}
      $fixedHeight={fixedSizes?.height || parentSizes?.height || parentSizes?.width}
      $touchAction={touchAction}
    >
      {indicatorProps.showIndicators ||
        (indicatorProps?.position && (
          <CarouselIndicators
            position={indicatorProps.position}
            axis={axis}
            size={data.length}
            currentIndex={currentIndex}
            color={accentColor}
            zIndex={indicatorProps.zIndex}
          />
        ))}
      {/* CAROUSEL CONTENT */}
      {springs.map((props, index, { length }) => {
        if (!parentSizes?.width) return null

        const styleProps = axis === 'x' ? { ...props, width: itemSize } : { ...props, height: itemSize }

        return (
          <AnimatedDivContainer
            {...bind(index)}
            key={index}
            ref={setScrollingZoneRef}
            style={styleProps}
            $borderRadius="0px"
            $withBoxShadow={false}
            $isVerticalScroll={axis === 'y'}
            $touchAction={touchAction}
          >
            <CarouselStep
              index={index}
              accentColor={accentColor}
              parentWidth={parentSizes.width}
              transformAmount={0}
              showButtons={false}
            >
              {children({ index, defaultImageTransforms, isLast: index === length - 1 })}
            </CarouselStep>
          </AnimatedDivContainer>
        )
      })}
    </CarouselContainer>
  )
}
