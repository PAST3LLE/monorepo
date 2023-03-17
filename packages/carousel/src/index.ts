import AnimatedCarousel from './components/AnimatedCarousel'
import ButtonCarousel from './components/ButtonCarousel'
// common components
import {
  CarouselContainer as StyledCarouselContainer,
  CarouselItemContainer as StyledCarouselItemContainer
} from './components/Common/styleds'
import HorizontalSwipeCarousel from './components/HorizontalSwipeCarousel'
import VerticalSwipeCarousel from './components/VerticalSwipeCarousel'
// types
import type {
  BaseAnimatedCarouselProps,
  BaseCarouselProps,
  ButtonCarouselProps,
  CarouselChildrenProps,
  TouchAction,
  WithTouchAction
} from './types'

export {
  // Core
  AnimatedCarousel,
  ButtonCarousel,
  HorizontalSwipeCarousel,
  VerticalSwipeCarousel,
  // Styleds
  StyledCarouselContainer,
  StyledCarouselItemContainer,
  // Types
  BaseAnimatedCarouselProps,
  BaseCarouselProps,
  ButtonCarouselProps,
  CarouselChildrenProps,
  TouchAction,
  WithTouchAction
}
