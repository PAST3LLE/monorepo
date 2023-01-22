import { transparentize } from 'polished'

import { ThemeModes } from '../types'

export const DEFAULT_COLOURS = {
  // base
  black: '#000',
  blackOpaque1: transparentize(0.15, '#000'),
  blackOpaque2: transparentize(0.3, '#000'),
  blackOpaque3: transparentize(0.5, '#000'),
  // whites
  white: '#e5e5e5',
  whiteDark: '#e9e9f0',
  offWhite: 'ghostwhite',
  offWhiteOpaque1: transparentize(0.15, 'ghostwhite'),
  offWhiteOpaque2: transparentize(0.3, 'ghostwhite'),
  offWhiteOpaque3: transparentize(0.5, 'ghostwhite'),
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
  mainGradientDarker: 'linear-gradient(270deg, #6a2cff 0%, #185afb 100%)'
}
export const LIGHT_COLOURS = {
  // text
  text1: '#000000',
  text2: '#565A69',
  text3: '#888D9B',
  text4: '#C3C5CB',
  text5: '#EDEEF2',

  // backgrounds / greys
  bg1: '#ffc1ff',
  bg2: '#F7F8FA',
  bg3: '#C1FFC1',
  bg4: '#00a400',
  bg5: '#888D9B',

  //specialty colors
  modalBG: 'rgba(0,0,0,0.3)',
  advancedBG: 'rgba(255,255,255,0.6)',

  //primary colors
  primary1: '#ff007a',
  primary2: '#FF8CC3',
  primary3: '#FF99C9',
  primary4: '#F6DDE8',
  primary5: '#FDEAF1',

  // color text
  primaryText1: '#ff007a',

  // secondary colors
  secondary1: '#ff007a',
  secondary2: '#F6DDE8',
  secondary3: '#FDEAF1'
}

export const MODE_COLOURS = (mode: ThemeModes) => ({
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

  darkModeToggle: mode === ThemeModes.DARK ? DEFAULT_COLOURS.yellow3 : DEFAULT_COLOURS.purple1,
  darkModeSvg: mode === ThemeModes.DARK ? DEFAULT_COLOURS.purple3 : DEFAULT_COLOURS.yellow3,
  darkModeFilter: mode === ThemeModes.DARK ? 'invert(1) brightness(0.8) hue-rotate(247deg) saturate(2)' : '',
  darkModeLogoFilter:
    mode === ThemeModes.DARK
      ? 'invert(1) saturate(1.4) hue-rotate(180deg) drop-shadow(0px 0px 12px rgba(0,0,0,1))'
      : 'drop-shadow(0px 0px 12px rgba(0,0,0,1))',

  // misc
  inputHoverColor: mode === ThemeModes.DARK ? DEFAULT_COLOURS.purple3 : DEFAULT_COLOURS.purple,

  // elems
  products: {
    aside: {
      itemContainer: mode === ThemeModes.DARK ? DEFAULT_COLOURS.blackOpaque1 : DEFAULT_COLOURS.offWhiteOpaque1,
      textColor: mode === ThemeModes.DARK ? DEFAULT_COLOURS.offWhite : DEFAULT_COLOURS.black,
      subItemDescription: mode === ThemeModes.DARK ? DEFAULT_COLOURS.blackOpaque2 : DEFAULT_COLOURS.offWhiteOpaque3,
      inputs: mode === ThemeModes.DARK ? DEFAULT_COLOURS.black : DEFAULT_COLOURS.offWhite,
      inputsBorderColor: mode === ThemeModes.DARK ? DEFAULT_COLOURS.purple3 : 'transparent'
    }
  }
})

export const THEME_COLOURS = (mode: ThemeModes) => ({
  ...DEFAULT_COLOURS,
  ...MODE_COLOURS(mode)
})
