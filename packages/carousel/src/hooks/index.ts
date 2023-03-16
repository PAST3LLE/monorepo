import { LqImageOptions } from '@past3lle/components'
import { useStateRef, useWindowSize } from '@past3lle/hooks'
import { useEffect, useMemo, useState } from 'react'

import { BaseCarouselProps } from '../types'

export interface CarouselSetup {
  parentSizes: { width: number | undefined; height: number | undefined } | undefined
  carouselContainer: HTMLElement | null
  imageTransformations: Omit<LqImageOptions, 'showLoadingIndicator'> & { pr: boolean }
  setCarouselContainerRef: (newNode: HTMLElement | null) => void
}
export function useCarouselSetup(dimensions: BaseCarouselProps<any[]>['dimensions']): CarouselSetup {
  const [parentSizes, setParentSizes] = useState<CarouselSetup['parentSizes']>()

  // ref to carousel container
  const [carouselContainer, setCarouselContainerRef] = useStateRef<HTMLDivElement | null>(null, (node) => node)

  // set carouselContainer states and focus carousel
  useEffect(() => {
    if (dimensions?.fixedSizes?.height && dimensions?.fixedSizes?.width) return

    setParentSizes({
      width: carouselContainer?.parentElement?.offsetWidth,
      height: carouselContainer?.parentElement?.offsetHeight
    })

    carouselContainer?.focus()
  }, [dimensions?.fixedSizes, carouselContainer])

  const windowSizes = useWindowSize()
  // adjust refs on window size changes
  useEffect(() => {
    if (dimensions?.fixedSizes?.height && dimensions?.fixedSizes?.width) return
    setParentSizes({
      width: carouselContainer?.parentElement?.offsetWidth,
      height: carouselContainer?.parentElement?.offsetHeight
    })
  }, [
    dimensions?.fixedSizes,
    carouselContainer?.parentElement?.offsetWidth,
    carouselContainer?.parentElement?.offsetHeight,
    carouselContainer?.parentElement?.clientHeight,
    windowSizes
  ])

  const imageTransformations = useMemo(
    () => ({
      width: _getTransformationsFromValue(dimensions?.fixedSizes?.width, carouselContainer?.clientWidth || 0),
      height: _getTransformationsFromValue(
        dimensions?.fixedSizes?.height,
        carouselContainer?.clientHeight || carouselContainer?.clientWidth || 0
      ),
      pr: true
    }),
    [dimensions?.fixedSizes, carouselContainer?.clientWidth, carouselContainer?.clientHeight]
  )

  return {
    parentSizes: {
      height: dimensions?.fixedSizes?.height || parentSizes?.height,
      width: dimensions?.fixedSizes?.width || parentSizes?.width
    } as CarouselSetup['parentSizes'],
    carouselContainer,
    imageTransformations,
    setCarouselContainerRef
  }
}

function _getTransformationsFromValue(val: string | number | undefined, fallback: number) {
  if (!val || typeof val === 'string') {
    return fallback
  }

  return val
}
