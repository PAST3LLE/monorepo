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
export function useCarouselSetup({ fixedSizes }: Pick<BaseCarouselProps, 'fixedSizes'>): CarouselSetup {
  const [parentSizes, setParentSizes] = useState<CarouselSetup['parentSizes']>()

  // ref to carousel container
  const [carouselContainer, setCarouselContainerRef] = useStateRef<HTMLDivElement | null>(null, (node) => node)

  // set carouselContainer states and focus carousel
  useEffect(() => {
    setParentSizes({
      width: carouselContainer?.parentElement?.offsetWidth,
      height: carouselContainer?.parentElement?.offsetHeight
    })

    carouselContainer?.focus()
  }, [carouselContainer])

  const windowSizes = useWindowSize()
  // adjust refs on window size changes
  useEffect(() => {
    setParentSizes({
      width: carouselContainer?.parentElement?.offsetWidth,
      height: carouselContainer?.parentElement?.offsetHeight
    })
  }, [
    carouselContainer?.parentElement?.offsetWidth,
    carouselContainer?.parentElement?.offsetHeight,
    carouselContainer?.parentElement?.clientHeight,
    windowSizes.ar
  ])

  const imageTransformations = useMemo(
    () => ({
      width: _getTransformationsFromValue(fixedSizes?.width, carouselContainer?.clientWidth || 0),
      height: _getTransformationsFromValue(
        fixedSizes?.height,
        carouselContainer?.clientHeight || carouselContainer?.clientWidth || 0
      ),
      pr: true
    }),
    [fixedSizes, carouselContainer?.clientWidth, carouselContainer?.clientHeight]
  )

  return {
    parentSizes: { ...parentSizes, width: fixedSizes?.width || parentSizes?.width } as CarouselSetup['parentSizes'],
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
