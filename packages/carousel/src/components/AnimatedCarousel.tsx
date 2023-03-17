import React from 'react'
import { useMemo } from 'react'

import { useCarouselSetup } from '../hooks'
import { BaseAnimatedCarouselProps } from '../types'
import { CarouselIndicators, CarouselItem } from './Common'
import { AnimatedDivContainer, CarouselContainer } from './Common/styleds'

export default function AnimatedCarousel<D extends any[]>({
  data,
  axis,
  colors,
  dimensions,
  touchAction,
  animationProps,
  indicatorOptions = { showIndicators: true },
  children
}: BaseAnimatedCarouselProps<D>) {
  const {
    parentSizes,
    imageTransformations: defaultImageTransforms,
    setCarouselContainerRef
  } = useCarouselSetup(dimensions)

  const {
    bind,
    springs,
    state: { currentIndex, itemSize },
    refCallbacks: { setItemSizeRef, setScrollingZoneRef }
  } = animationProps

  const calculatedSizes = useMemo(
    () =>
      dimensions?.fillContainer
        ? { height: '100%', width: '100%' }
        : axis === 'x'
        ? { width: Math.max(itemSize, parentSizes?.width || 0) }
        : { height: Math.max(itemSize, parentSizes?.height || 0) },
    [axis, dimensions?.fillContainer, itemSize, parentSizes?.height, parentSizes?.width]
  )

  return (
    <CarouselContainer
      id="#carousel-container"
      ref={(node) => {
        setCarouselContainerRef(node)
        setItemSizeRef(node)
      }}
      $fixedHeight={dimensions?.fixedSizes?.height || parentSizes?.height || parentSizes?.width}
      $touchAction={touchAction}
    >
      {indicatorOptions.showIndicators ||
        (indicatorOptions?.position && (
          <CarouselIndicators
            position={indicatorOptions.position}
            axis={axis}
            size={data.length}
            currentIndex={currentIndex}
            accent={colors?.accent}
            zIndex={indicatorOptions.zIndex}
          />
        ))}
      {/* CAROUSEL CONTENT */}
      {springs.map((interpolatedProps, index, { length }) => {
        if (!parentSizes?.width || !parentSizes?.height) return null

        const animatedStyleProps = { ...interpolatedProps, ...calculatedSizes }

        return (
          <AnimatedDivContainer
            {...bind(index)}
            key={index}
            ref={setScrollingZoneRef}
            style={animatedStyleProps}
            // custom style props
            $axis={axis}
            $borderRadius="0px"
            $touchAction={touchAction}
            $withBoxShadow={false}
          >
            <CarouselItem
              index={index}
              colors={colors}
              parentWidth={parentSizes.width}
              transformAmount={0}
              showButtons={false}
            >
              {children({ index, defaultImageTransforms, isLast: index === length - 1 })}
            </CarouselItem>
          </AnimatedDivContainer>
        )
      })}
    </CarouselContainer>
  )
}
