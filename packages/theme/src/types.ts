export type Color = string
export interface Colors {
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

export interface Sections {
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

export enum ThemeModes {
  LIGHT = 'LIGHT',
  DARK = 'DARK'
}

export interface ThemeState {
  mode: ThemeModes
  setMode: React.Dispatch<React.SetStateAction<ThemeModes>>
  autoDetect: boolean
}

export const THEME_LIST = Object.entries(ThemeModes)

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeState, Colors, Sections {
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

    // filters
    darkModeFilter: string
    darkModeLogoFilter: string

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
      upToExtraLarge: ThemedCssFunction<DefaultTheme>
    }

    // from media size
    fromMediaWidth: {
      fromExtraSmall: ThemedCssFunction<DefaultTheme>
      fromSmall: ThemedCssFunction<DefaultTheme>
      fromMedium: ThemedCssFunction<DefaultTheme>
      fromLarge: ThemedCssFunction<DefaultTheme>
      fromExtraLarge: ThemedCssFunction<DefaultTheme>
    }

    // between media size
    betweenMediaWidth: {
      betweenExtraSmallAndSmall: ThemedCssFunction<DefaultTheme>
      betweenSmallAndMedium: ThemedCssFunction<DefaultTheme>
      betweenMediumAndLarge: ThemedCssFunction<DefaultTheme>
      betweenLargeAndExtraLarge: ThemedCssFunction<DefaultTheme>
      // random but useful
      betweenSmallAndLarge: ThemedCssFunction<DefaultTheme>
    }

    // height
    mediaHeight: {
      upToExtraSmallHeight: ThemedCssFunction<DefaultTheme>
      upToSmallHeight: ThemedCssFunction<DefaultTheme>
      upToMediumHeight: ThemedCssFunction<DefaultTheme>
      upToLargeHeight: ThemedCssFunction<DefaultTheme>
      upToExtraLargeHeight: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
