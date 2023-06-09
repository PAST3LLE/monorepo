import { GenericImageSrcSet } from '@past3lle/types'
import React from 'react'
import { ThemedCssFunction } from 'styled-components'

import { MediaWidths } from './styles'
import { ThemeTemplates } from './templates'

export type ImageKitUrl = `https://ik.imagekit.io/${string}/${string}`

export type BackgroundPropertyFull = GenericImageSrcSet<MediaWidths> | ImageKitUrl | string

export type Color = string

export interface ThemeBaseColoursRequired {
  // black
  readonly black: Color
  readonly blackOpaque: Color
  readonly blackOpaqueMore: Color
  readonly blackOpaqueMost: Color
  // offblack
  readonly offblack: Color
  readonly offblackOpaque: Color
  readonly offblackOpaqueMore: Color
  readonly offblackOpaqueMost: Color
  // whites
  readonly white: Color
  readonly whiteOpaque: Color
  readonly whiteOpaqueMore: Color
  readonly whiteOpaqueMost: Color
  // offwhite
  readonly offwhite: Color
  readonly offwhiteOpaque: Color
  readonly offwhiteOpaqueMore: Color
  readonly offwhiteOpaqueMost: Color
}
export interface ThemeContentPartsRequired {
  button: {
    border: {
      radius: Color
      colour: Color
      border: Color
    }
    hoverColour: Color
    fontSize: {
      small: Color
      normal: Color
      large: Color
    }
  }
  input: {
    border: {
      radius: Color
      colour: Color
      border: Color
    }
    hoverColour: Color
  }
  content: {
    background: Color
    backgroundAlt: Color
    text: Color
    textAlt: Color
  }
}

export type ThemeContentPartsRequiredByMode = ThemeByModes<ThemeContentPartsRequired>

export type AvailableThemeTemplate = keyof typeof ThemeTemplates
export interface ThemeMinimumRequired {
  baseColours: ThemeBaseColoursRequired
  baseContent: ThemeContentPartsRequiredByMode
}

export type BasicUserTheme = Record<string, any>

export type CustomThemeOrTemplate<T, K, M extends BasicUserTheme = BasicUserTheme> = ThemeMediaWidthsBaseRequired &
  ThemeMinimumRequired &
  (T extends ThemeByModes<M>
    ? T extends undefined
      ? ThemeMinimumRequired
      : T
    : K extends AvailableThemeTemplate
    ? (typeof ThemeTemplates)[K]
    : void)

export type ThemeSubModesRequired = 'LIGHT' | 'DARK'

export type Subset<K> = {
  [attr in keyof K]?: K[attr] extends object
    ? Subset<K[attr]>
    : K[attr] extends object
    ? Subset<K[attr]>
    : K[attr] extends object | undefined
    ? Subset<K[attr]> | undefined
    : K[attr]
}

export type ThemeByModes<T extends BasicUserTheme = BasicUserTheme> = {
  modes: {
    DEFAULT: T
  } & {
    [key in ThemeSubModesRequired]: Subset<T>
  }
}
export type ThemeModesRequired = keyof ThemeByModes['modes']

export interface ThemeStateBaseRequired<M = ThemeModesRequired> {
  mode: M
  autoDetect: boolean
  setMode: React.Dispatch<React.SetStateAction<ThemeModesRequired>>
  setAutoDetect: React.Dispatch<React.SetStateAction<boolean>>
}

export interface ThemeMediaWidthsBaseRequired {
  // media queries
  mediaWidth: {
    upToExtraSmall: ThemedCssFunction<Record<any, any>>
    upToSmall: ThemedCssFunction<Record<any, any>>
    upToMedium: ThemedCssFunction<Record<any, any>>
    upToLarge: ThemedCssFunction<Record<any, any>>
    upToExtraLarge: ThemedCssFunction<Record<any, any>>
  }

  // from media size
  fromMediaWidth: {
    fromExtraSmall: ThemedCssFunction<Record<any, any>>
    fromSmall: ThemedCssFunction<Record<any, any>>
    fromMedium: ThemedCssFunction<Record<any, any>>
    fromLarge: ThemedCssFunction<Record<any, any>>
    fromExtraLarge: ThemedCssFunction<Record<any, any>>
  }

  // between media size
  betweenMediaWidth: {
    betweenExtraSmallAndSmall: ThemedCssFunction<Record<any, any>>
    betweenSmallAndMedium: ThemedCssFunction<Record<any, any>>
    betweenMediumAndLarge: ThemedCssFunction<Record<any, any>>
    betweenLargeAndExtraLarge: ThemedCssFunction<Record<any, any>>
    // random but useful
    betweenSmallAndLarge: ThemedCssFunction<Record<any, any>>
  }

  // height
  mediaHeight: {
    upToExtraSmallHeight: ThemedCssFunction<Record<any, any>>
    upToSmallHeight: ThemedCssFunction<Record<any, any>>
    upToMediumHeight: ThemedCssFunction<Record<any, any>>
    upToLargeHeight: ThemedCssFunction<Record<any, any>>
    upToExtraLargeHeight: ThemedCssFunction<Record<any, any>>
  }
}

export interface ThemeBaseRequired<M = ThemeModesRequired>
  extends ThemeBaseColoursRequired,
    ThemeContentPartsRequired,
    ThemeStateBaseRequired<M>,
    ThemeMediaWidthsBaseRequired {}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ThemeBaseRequired {}
}
