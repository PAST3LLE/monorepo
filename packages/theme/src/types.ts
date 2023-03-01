import React from 'react'
import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type BaseThemeTypes =
  | boolean
  | string
  | number
  | ((...args: any[]) => any)
  | React.Dispatch<React.SetStateAction<any>>
  | ThemedCssFunction<any>

export type ThemeValueTypes = BaseThemeTypes | Record<string, BaseThemeTypes>

export type Color = string
export interface PastelleColors {
  // base
  white: Color
  offWhite: Color
  offWhiteOpaque1: Color
  offWhiteOpaque2: Color
  offWhiteOpaque3: Color
  black: Color
  blackOpaque1: Color
  blackOpaque2: Color
  blackOpaque3: Color

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color
  textDisabled: Color

  // backgrounds / greys
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  bgDisabled: Color

  modalBG: Color
  advancedBG: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color

  primaryText1: Color

  // pinks
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // other
  red1: Color
  red2: Color
  red3: Color
  green1: Color
  green2: Color
  yellow1: Color
  yellow2: Color
  blue1: Color
  purple: Color
  purple1: Color
  purple2: Color
  purple3: Color

  // states
  dangerLight: Color
  warningLight: Color
  inputHoverColor: Color
  darkModeToggle: Color
  darkModeSvg: Color
}

export interface PastelleSections {
  // elems
  products: {
    aside: {
      itemContainer: Color
      textColor: Color
      subItemDescription: Color
      inputs: Color
      inputsBorderColor: Color
    }
  }
}

export interface PastelleFilters {
  // filters
  darkModeFilter: string
  darkModeLogoFilter: string
}

export enum ThemeModes {
  LIGHT = 'LIGHT',
  DARK = 'DARK'
}

export interface ThemeStateBaseRequired<M = ThemeModes> {
  mode: M
  autoDetect: boolean
  setMode: React.Dispatch<React.SetStateAction<ThemeModes>>
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

export interface ThemeBaseRequired<M = ThemeModes> extends ThemeStateBaseRequired<M>, ThemeMediaWidthsBaseRequired {}

export interface PastelleDefaultTheme extends ThemeBaseRequired, PastelleFilters, PastelleColors, PastelleSections {
  // theming
  buttons: {
    font: {
      size: {
        small: string
        normal: string
        large: string
      }
    }
    borderRadius: string
    border: string
  }
  // gradient
  whiteGradient1: FlattenSimpleInterpolation

  // shadows
  shadow1: string
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ThemeBaseRequired {}
}
