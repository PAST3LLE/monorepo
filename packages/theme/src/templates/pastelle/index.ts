import { FlattenSimpleInterpolation, css } from 'styled-components'

import { ThemeByModes } from '../../types'
import { ThemeBaseColoursRequired, ThemeContentPartsRequired } from '../../types'
import { BaseColours, BaseContent } from '../base'

const BaseColoursRequired: ThemeBaseColoursRequired = BaseColours

export type PastelleThemeExtension = Partial<ThemeContentPartsRequired> & {
  red1: string
  red2: string
  red3: string
  // greens
  green1: string
  green2: string
  yellow1: string
  yellow2: string
  yellow3: string
  blue1: string
  blue: string
  blueDark: string
  purple: string
  purple1: string
  purple2: string
  purple3: string
  bgLight: string
  bgDark: string
  blackLight: string
  successLight: string
  successDark: string
  dangerLight: string
  dangerDark: string
  warningLight: string
  warningDark: string
  bgDisabled: string
  disabledDarkOpaque: string
  textDisabled: string
  disabledDark: string
  mainGradient: string
  mainGradientDarker: string

  // text
  text1: string
  text2: string
  text3: string
  text4: string
  text5: string

  // backgrounds / greys
  bg1: string
  bg2: string
  bg3: string
  bg4: string
  bg5: string

  //specialty colors
  modalBG: string
  advancedBG: string

  //primary colors
  primary1: string
  primary2: string
  primary3: string
  primary4: string
  primary5: string

  // color text
  primaryText1: string

  // secondary colors
  secondary1: string
  secondary2: string
  secondary3: string

  // shadows
  shadow1: string
  // gradients
  whiteGradient1: FlattenSimpleInterpolation
  // toggle colours/effects
  modeToggle: string
  modeSvg: string
  modeFilter: string
  modeLogoFilter: string
  // rarity colours
  rarity: {
    empty: {
      backgroundColor: string
      boxShadowColor: string
    }
    common: {
      backgroundColor: string
      boxShadowColor: string
    }
    rare: {
      backgroundColor: string
      boxShadowColor: string
    }
    legendary: {
      backgroundColor: string
      boxShadowColor: string
    }
    epic: {
      backgroundColor: string
      boxShadowColor: string
    }
  }
}
const PastelleTheme: ThemeByModes<PastelleThemeExtension> = {
  modes: {
    DEFAULT: {
      // reds
      red1: '#FF6871',
      red2: '#200202',
      red3: '#620c0c',
      // greens
      green1: '#09371d',
      green2: '#a9ffcd',
      yellow1: '#FFE270',
      yellow2: '#F3841E',
      yellow3: 'lightgoldenrodyellow',
      blue1: '#2172E5',
      blue: '#3F77FF',
      blueDark: '#185afb',
      purple: '#8958FF',
      purple1: '#200d36eb',
      purple2: '#5e3f83eb',
      purple3: '#4a002f',
      bgLight: '#edf2f7',
      bgDark: 'linear-gradient(0deg, #21222E 0.05%, #2C2D3F 100%)',
      blackLight: '#181a1b',
      successLight: '#5ca95c',
      successDark: '#00BE2E',
      dangerLight: '#e55353', // #ff9d9d,
      dangerDark: '#eb4025',
      warningLight: '#f1851d',
      warningDark: '#f1851d',
      bgDisabled: '#8a8a8a80',
      disabledDarkOpaque: '#ffffff80',
      textDisabled: '#31323E',
      disabledDark: '#31323E',
      mainGradient: 'linear-gradient(270deg, #8958FF 0%, #3F77FF 100%)',
      mainGradientDarker: 'linear-gradient(270deg, #6a2cff 0%, #185afb 100%)',

      // text
      text1: '#FFFFFF',
      text2: '#C3C5CB',
      text3: '#6C7284',
      text4: '#565A69',
      text5: '#2C2F36',

      // backgrounds / greys
      bg1: '#212429',
      bg2: '#2C2F36',
      bg3: '#40444F',
      bg4: '#565A69',
      bg5: '#6C7284',

      //specialty colors
      modalBG: 'rgba(0,0,0,.425)',
      advancedBG: 'rgba(0,0,0,0.1)',

      //primary colors
      primary1: '#2172E5',
      primary2: '#3680E7',
      primary3: '#4D8FEA',
      primary4: '#376bad70',
      primary5: '#153d6f70',

      // color text
      primaryText1: '#6da8ff',

      // secondary colors
      secondary1: '#2172E5',
      secondary2: '#17000b26',
      secondary3: '#17000b26',

      // shadows
      shadow1: '#2F80ED',
      // gradients
      whiteGradient1: css`
        background-image: linear-gradient(to top, ghostwhite, #fff 53%);
      `,
      get modeToggle() {
        return this.purple1
      },
      get modeSvg() {
        return this.yellow3
      },
      modeFilter: '',
      modeLogoFilter: 'drop-shadow(0px 0px 12px rgba(0,0,0,1))',
      // content
      input: {
        ...BaseContent.DEFAULT.input,
        border: {
          ...BaseContent.DEFAULT.input.border,
          colour: 'transparent'
        },
        hoverColour: '#4a002f'
      },
      // rarity colours
      rarity: {
        empty: {
          backgroundColor: 'transparent',
          boxShadowColor: '0px 0px transparent'
        },
        common: {
          backgroundColor: '#969696b3',
          boxShadowColor: '12px 2px #969696b3'
        },
        rare: { backgroundColor: '#6495ed', boxShadowColor: '12px 2px #6495ed' },
        legendary: {
          backgroundColor: '#ab64ffbd',
          boxShadowColor: '12px 8px #8000809e'
        },
        epic: { backgroundColor: '#ffb467', boxShadowColor: '12px 8px #ffb467' }
      }
    },
    DARK: {
      modeToggle: 'lightgoldenrodyellow',
      modeSvg: '#4a002f',
      modeLogoFilter: 'invert(1) saturate(1.4) hue-rotate(180deg) drop-shadow(0px 0px 12px rgba(0,0,0,1))',
      // content
      input: {
        ...BaseContent.DARK.input,
        border: {
          ...BaseContent.DARK.input.border,
          colour: '#4a002f'
        },
        hoverColour: '#4a002f'
      }
    },
    LIGHT: {
      modeFilter: 'invert(1) brightness(0.8) hue-rotate(247deg) saturate(2)'
    }
  }
} as const

export const Theme = {
  ...BaseColoursRequired,
  ...PastelleTheme
}
