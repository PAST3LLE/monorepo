import { CSSObject, DefaultTheme, FlattenSimpleInterpolation, ThemedCssFunction, css } from 'styled-components'

import { ThemeBaseRequired } from '../types'

export type MediaHeights = 400 | 600 | 768 | 1080 | 2160
export const MEDIA_HEIGHTS: { [key in keyof ThemeBaseRequired['mediaHeight']]: MediaHeights } = {
  upToExtraSmallHeight: 400,
  upToSmallHeight: 600,
  upToMediumHeight: 768,
  upToLargeHeight: 1080,
  upToExtraLargeHeight: 2160
}

export type MediaWidths = 500 | 720 | 960 | 1280 | 1440
export const MEDIA_WIDTHS: { [key in keyof ThemeBaseRequired['mediaWidth']]: MediaWidths } = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
  upToExtraLarge: 1440
}

export const FROM_MEDIA_WIDTHS = {
  fromExtraSmall: MEDIA_WIDTHS.upToExtraSmall,
  fromSmall: MEDIA_WIDTHS.upToSmall,
  fromMedium: MEDIA_WIDTHS.upToMedium,
  fromLarge: MEDIA_WIDTHS.upToLarge,
  fromExtraLarge: MEDIA_WIDTHS.upToExtraLarge
}

export const BETWEEN_MEDIA_WIDTHS = {
  betweenExtraSmallAndSmall: [MEDIA_WIDTHS.upToExtraSmall, MEDIA_WIDTHS.upToSmall],
  betweenSmallAndMedium: [MEDIA_WIDTHS.upToSmall, MEDIA_WIDTHS.upToMedium],
  betweenMediumAndLarge: [MEDIA_WIDTHS.upToMedium, MEDIA_WIDTHS.upToLarge],
  betweenLargeAndExtraLarge: [MEDIA_WIDTHS.upToLarge, MEDIA_WIDTHS.upToExtraLarge],
  // weird but useful
  betweenSmallAndLarge: [MEDIA_WIDTHS.upToSmall, MEDIA_WIDTHS.upToLarge]
}

type MediaHeightKeys = keyof typeof MEDIA_HEIGHTS
type MediaWidthKeys = keyof typeof MEDIA_WIDTHS
type FromMediaWidthKeys = keyof typeof FROM_MEDIA_WIDTHS
type BetweenMediaWidthKeys = keyof typeof BETWEEN_MEDIA_WIDTHS

type MediaHeight = {
  [key in MediaHeightKeys]: ThemedCssFunction<DefaultTheme>
}
type MediaWidth = {
  [key in MediaWidthKeys]: ThemedCssFunction<DefaultTheme>
}
type FromMediaWidth = {
  [key in FromMediaWidthKeys]: ThemedCssFunction<DefaultTheme>
}
type BetweenMediaWidth = {
  [key in BetweenMediaWidthKeys]: ThemedCssFunction<DefaultTheme>
}

// height
export const mediaHeightTemplates = Object.keys(MEDIA_HEIGHTS).reduce<MediaHeight>((accumulator, size: unknown) => {
  ;(accumulator[size as MediaHeightKeys] as unknown) = (
    a: CSSObject,
    b: CSSObject,
    c: CSSObject
  ): ThemedCssFunction<DefaultTheme> | FlattenSimpleInterpolation => css`
    @media (max-height: ${MEDIA_HEIGHTS[size as MediaHeightKeys]}px) {
      ${css(a, b, c)}
    }
  `
  return accumulator
}, {} as MediaHeight)

export const mediaWidthTemplates = Object.keys(MEDIA_WIDTHS).reduce<MediaWidth>((accumulator, size: unknown) => {
  ;(accumulator[size as MediaWidthKeys] as unknown) = (
    a: CSSObject,
    b: CSSObject,
    c: CSSObject
  ): ThemedCssFunction<DefaultTheme> | FlattenSimpleInterpolation => css`
    @media (max-width: ${MEDIA_WIDTHS[size as MediaWidthKeys]}px) {
      ${css(a, b, c)}
    }
  `
  return accumulator
}, {} as MediaWidth)

export const fromMediaWidthTemplates = Object.keys(FROM_MEDIA_WIDTHS).reduce<FromMediaWidth>(
  (accumulator, size: unknown) => {
    ;(accumulator[size as FromMediaWidthKeys] as unknown) = (
      a: CSSObject,
      b: CSSObject,
      c: CSSObject
    ): ThemedCssFunction<DefaultTheme> | FlattenSimpleInterpolation => css`
      @media (min-width: ${FROM_MEDIA_WIDTHS[size as FromMediaWidthKeys] + 1}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {} as FromMediaWidth
)

export const betweenMediaWidthTemplates = Object.keys(BETWEEN_MEDIA_WIDTHS).reduce<BetweenMediaWidth>(
  (accumulator, size: unknown) => {
    ;(accumulator[size as BetweenMediaWidthKeys] as unknown) = (
      a: CSSObject,
      b: CSSObject,
      c: CSSObject
    ): ThemedCssFunction<DefaultTheme> | FlattenSimpleInterpolation => css`
      @media (min-width: ${BETWEEN_MEDIA_WIDTHS[size as BetweenMediaWidthKeys][0] +
        1}px) and (max-width: ${BETWEEN_MEDIA_WIDTHS[size as BetweenMediaWidthKeys][1]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {} as BetweenMediaWidth
)
