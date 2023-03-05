import { transparentize } from 'polished'

import { Color, ThemeMinimumRequired } from '../types'

/**
 * Base required colours. Can be imported or replaced
 */
export const BaseColours = {
  // base
  black: '#000',
  blackOpaque: transparentize(0.15, '#000'),
  blackOpaqueMore: transparentize(0.3, '#000'),
  blackOpaqueMost: transparentize(0.5, '#000'),
  offblack: '#242424',
  offblackOpaque: transparentize(0.15, '#242424'),
  offblackOpaqueMore: transparentize(0.3, '#242424'),
  offblackOpaqueMost: transparentize(0.5, '#242424'),
  // whites
  white: '#e5e5e5',
  whiteOpaque: transparentize(0.15, '#e5e5e5'),
  whiteOpaqueMore: transparentize(0.3, '#e5e5e5'),
  whiteOpaqueMost: transparentize(0.5, '#e5e5e5'),
  offwhite: 'ghostwhite',
  offwhiteOpaque: transparentize(0.15, 'ghostwhite'),
  offwhiteOpaqueMore: transparentize(0.3, 'ghostwhite'),
  offwhiteOpaqueMost: transparentize(0.5, 'ghostwhite')
} as const

/**
 * Base required content. Can be imported or replaced
 */
export const BaseContent = {
  button: {
    fontSize: {
      small: '1rem',
      normal: '1.2rem',
      large: '1.6rem'
    },
    border: {
      radius: '1rem',
      border: '0.1rem solid transparent',
      colour: 'none'
    },
    hoverColour: 'none'
  },
  input: {
    border: {
      radius: '1rem',
      border: 'none',
      colour: [BaseColours.offwhiteOpaque, 'transparent'] as Color
    },
    hoverColour: [BaseColours.offwhiteOpaque, BaseColours.offblackOpaque] as Color
  },
  content: {
    background: [BaseColours.blackOpaque, BaseColours.offwhiteOpaque] as Color,
    backgroundAlt: [BaseColours.offwhiteOpaque, BaseColours.blackOpaque] as Color,
    text: [BaseColours.offwhite, BaseColours.black] as Color,
    textAlt: [BaseColours.blackOpaqueMore, BaseColours.offwhiteOpaqueMost] as Color
  }
}

export const BaseTheme: ThemeMinimumRequired = { ...BaseColours, ...BaseContent }
