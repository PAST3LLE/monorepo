import { transparentize } from 'polished'

import { ThemeMinimumRequired } from '../types'

const BLACK_CLASSIC_HEX = '#000'
const OFF_BLACK_HEX = '#242424'
const WHITE_HEX = '#e5e5e5'
const OFF_WHITE_HEX = '#f8f8ff'
const TRANSPARENT_RGB = 'rgba(0,0,0,0)'
/**
 * Base required colours. Can be imported or replaced
 */
export const BaseColours = {
  // base
  black: BLACK_CLASSIC_HEX,
  blackOpaque: transparentize(0.15, BLACK_CLASSIC_HEX),
  blackOpaqueMore: transparentize(0.3, BLACK_CLASSIC_HEX),
  blackOpaqueMost: transparentize(0.5, BLACK_CLASSIC_HEX),
  offblack: OFF_BLACK_HEX,
  offblackOpaque: transparentize(0.15, OFF_BLACK_HEX),
  offblackOpaqueMore: transparentize(0.3, OFF_BLACK_HEX),
  offblackOpaqueMost: transparentize(0.5, OFF_BLACK_HEX),
  // whites
  white: WHITE_HEX,
  whiteOpaque: transparentize(0.15, WHITE_HEX),
  whiteOpaqueMore: transparentize(0.3, WHITE_HEX),
  whiteOpaqueMost: transparentize(0.5, WHITE_HEX),
  offwhite: OFF_WHITE_HEX,
  offwhiteOpaque: transparentize(0.15, OFF_WHITE_HEX),
  offwhiteOpaqueMore: transparentize(0.3, OFF_WHITE_HEX),
  offwhiteOpaqueMost: transparentize(0.5, OFF_WHITE_HEX)
} as const

/**
 * Base required content. Can be imported or replaced
 */
export const BaseContent = {
  DEFAULT: {
    button: {
      fontSize: {
        small: '1rem',
        normal: '1.2rem',
        large: '1.6rem'
      },
      border: {
        radius: '1rem',
        border: `0.1rem solid ${TRANSPARENT_RGB}`,
        colour: TRANSPARENT_RGB
      },
      hoverColour: 'none'
    },
    input: {
      border: {
        radius: '1rem',
        border: 'none',
        colour: BaseColours.offwhiteOpaque
      },
      hoverColour: BaseColours.offwhiteOpaque
    },
    content: {
      background: BaseColours.blackOpaque,
      backgroundAlt: BaseColours.offwhiteOpaque,
      text: BaseColours.offwhite,
      textAlt: BaseColours.blackOpaqueMore
    }
  },
  LIGHT: {
    input: {
      border: {
        colour: TRANSPARENT_RGB
      },
      hoverColour: BaseColours.offblackOpaque
    },
    content: {
      background: BaseColours.offwhiteOpaque,
      backgroundAlt: BaseColours.blackOpaque,
      text: BaseColours.black
    }
  },
  DARK: {
    input: {
      border: {
        colour: BaseColours.offwhiteOpaque
      },
      hoverColour: BaseColours.offwhiteOpaque
    },
    content: {
      background: BaseColours.blackOpaque,
      backgroundAlt: BaseColours.offwhiteOpaque,
      text: BaseColours.offwhite,
      textAlt: BaseColours.blackOpaqueMore
    }
  }
}

export const BaseTheme: ThemeMinimumRequired = { baseColours: BaseColours, baseContent: { modes: { ...BaseContent } } }
