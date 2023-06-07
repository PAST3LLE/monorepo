import { AxisDirection } from '@past3lle/carousel-hooks'
import { Row } from '@past3lle/components'
import { BLACK, OFF_WHITE } from '@past3lle/theme'
import { a } from '@react-spring/web'
import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

import { TouchAction } from '../../types'

const BaseCarouselStep = styled(Row)<{
  $width: number
  $height?: string
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ $width }) => $width}px;
  ${({ $height }) => $height && `height: ${$height};`}
  overflow: hidden;
  // TODO: BE SURE THIS ISNT SHITTY
  align-items: flex-start;

  img {
    max-width: 100%;
  }
`

export const CarouselItemContainer = styled(BaseCarouselStep)<{
  $transformAmount: number
}>`
  transform: ${({ $transformAmount }) => `translateX(${$transformAmount}px)`};

  // transform one differently than the others
  transition: ${({ $transformAmount }) =>
    $transformAmount > 0 ? 'transform 1s ease-in-out;' : 'transform 0.7s ease-out'};

  z-index: ${({ $transformAmount }) => ($transformAmount > 0 ? 1 : 0)};
`

export const AnimatedDivContainer = styled(a.div)<{
  $axis: AxisDirection
  $fillContainer?: boolean
  $withBoxShadow?: boolean
  $maxWidth?: string
  $maxHeight?: string
  $borderRadius?: string
  $touchAction: TouchAction
}>`
  touch-action: ${({ $touchAction }) => (typeof $touchAction === 'string' ? $touchAction : $touchAction?.join(' '))};
  will-change: transform;
  position: absolute;
  cursor: pointer;
  border-radius: ${({ $borderRadius = '0.9rem' }) => $borderRadius};
  overflow: hidden;

  width: 100%;
  height: 100%;
  max-width: ${({ $maxWidth = 'none' }) => $maxWidth};
  max-height: ${({ $maxHeight = 'none' }) => $maxHeight};

  ${({ $axis, $fillContainer }) =>
    $fillContainer
      ? `
    width: 100%;
    height: 100%;
    `
      : $axis === 'y'
      ? 'width: 100%;'
      : 'height: 100%;'}

  ${({ $withBoxShadow = true, theme }) =>
    $withBoxShadow && `box-shadow: 0px 0.1rem 2rem 0.9rem ${transparentize(0.5, theme.black)};`}

  &:hover {
    box-shadow: ${({ theme, $withBoxShadow = true }) =>
      $withBoxShadow &&
      `0px 0px 3rem 1rem ${theme.mode === 'DARK' ? theme.blackOpaqueMore : theme.offwhiteOpaqueMost}`};
  }

  transition: box-shadow 0.2s ease-in-out;
`

export const ScrollerContainer = styled.div<{ $touchAction: TouchAction; $isVerticalScroll: boolean }>`
  touch-action: ${({ $touchAction }) => (typeof $touchAction === 'string' ? $touchAction : $touchAction.join(' '))};
  ${({ $isVerticalScroll }) => ($isVerticalScroll ? 'height: 100%;' : 'width: 100%;')}
  position: relative;
  overflow: hidden;
  transition: transform 350ms ease-in-out;
`

export const CarouselContainer = styled(ScrollerContainer).attrs({ $isVerticalScroll: false })<{
  $fixedHeight?: number
  $fixedWidth?: number
}>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  // transform requirement
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  z-index: 1;
  ${({ $fixedHeight }) => $fixedHeight && `height: ${$fixedHeight}px;`}
  ${({ $fixedWidth }) => $fixedWidth && `width: ${$fixedWidth}px;`}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    > ${CarouselItemContainer} {
        max-width: 100%;
        height: auto;
      }
  `}
`

export const CarouselButton = styled.div<{ buttonColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 10%;
  background-color: ${({ buttonColor }) => transparentize(1, buttonColor)};

  cursor: pointer;

  &:hover {
    background-color: ${({ buttonColor }) => transparentize(0.7, buttonColor)};
  }

  transition: background-color 0.2s ease-in-out;
`

export const CarouselButtonContainer = styled.div`
  position: absolute;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  cursor: pointer;
`

export const CarouselIndicator = styled.div<{ isCurrent: boolean; color?: string }>`
  background: ${({ isCurrent, theme, color = theme.blackOpaqueMore }) => (isCurrent ? color : 'transparent')};
  color: ${({ isCurrent }) => (isCurrent ? BLACK : OFF_WHITE)};
  border: 1px solid ${({ isCurrent, theme, color = theme.blackOpaqueMore }) => (isCurrent ? 'transparent' : color)};
  border-radius: 1rem;
  flex: 0 1 12%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 400;
  padding: 0.25rem 0;
`

export type AbsolutePosition =
  | 'bottom-left'
  | 'middle-left'
  | 'top-left'
  | 'bottom-right'
  | 'middle-right'
  | 'top-right'
  | 'middle-bottom'
  | 'middle-top'

export function getAbsolutePosition(position: AbsolutePosition) {
  switch (position) {
    case 'bottom-left':
      return css`
        bottom: 7%;
        left: 0;
      `
    case 'middle-left':
      return css`
        bottom: 50%;
        left: 0;
      `
    case 'top-left':
      return css`
        top: 7%;
        left: 0;
      `
    case 'bottom-right':
      return css`
        bottom: 7%;
        right: 0;
      `
    case 'middle-right':
      return css`
        bottom: 50%;
        right: 0;
      `
    case 'top-right':
      return css`
        top: 7%;
        right: 0;
      `
    case 'middle-bottom':
      return css`
        bottom: 7%%;
        right: 50%;
      `
    case 'middle-top':
      return css`
        top: 7%;
        right: 50%;
      `
  }
}

export const CarouselIndicatorWrapper = styled(Row)<{
  axis: AxisDirection
  position: AbsolutePosition
  zIndex: number
}>`
  opacity: 0.5;
  position: absolute;
  ${({ position }) => getAbsolutePosition(position)}

  margin: 0;
  padding: 1rem;
  gap: 0.5rem;
  width: 100%;
  justify-content: flex-end;
  align-items: stretch;
  z-index: ${({ zIndex }) => zIndex};
  background: transparent;

  &:hover {
    opacity: 1;
  }

  transition: opacity, background 0.3 ease-in-out;

  ${({ axis }) =>
    axis === 'x'
      ? `flex-flow: row nowrap;`
      : `
        flex-flow: column nowrap;
        width: 45px;
      `}
`
