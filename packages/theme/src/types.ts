import React from 'react'
import { ThemedCssFunction } from 'styled-components'

export type Color = string | [Color, Color]

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
    background: Color // product.aside.itemContainer
    backgroundAlt: Color
    text: Color // product.aside.textColour
    textAlt: Color //product.aside.itemSubHeader
  }
}

export type ThemeModesRequired = 'LIGHT' | 'DARK'
export type ThemeModeColours = {
  [key in ThemeModesRequired]: Record<string, any>
}
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

// declare module 'styled-components' {
//   // eslint-disable-next-line @typescript-eslint/no-empty-interface
//   export interface DefaultTheme extends ThemeBaseRequired {}
// }
