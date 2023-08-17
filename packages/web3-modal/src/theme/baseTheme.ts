import { ThemeByModes } from '@past3lle/theme'

import { PstlModalThemeExtension } from './types'

const DEFAULT_BASE_MODAL_PROPS = {
  filter: 'none',
  baseFontSize: 16
} as const
const BASE_TEXT_COLOUR = 'ghostwhite'
const DEFAULT_FONT_PROPS = {
  color: BASE_TEXT_COLOUR,
  size: '1em',
  weight: 300,
  style: 'none',
  letterSpacing: '0px',
  lineHeight: 1,
  textShadow: 'none',
  textTransform: 'none',
  family: 'inherit'
} as const

const PstlModalTheme: ThemeByModes<PstlModalThemeExtension> = {
  modes: {
    LIGHT: {},
    DARK: {},
    DEFAULT: {
      modals: {
        base: {
          ...DEFAULT_BASE_MODAL_PROPS,
          font: DEFAULT_FONT_PROPS,
          title: {
            font: {
              color: BASE_TEXT_COLOUR,
              size: '2em',
              weight: 700,
              letterSpacing: '0px',
              lineHeight: 1,
              family: 'inherit',
              style: 'none',
              textShadow: 'none',
              textTransform: 'none'
            }
          }
        },
        connection: {
          ...DEFAULT_BASE_MODAL_PROPS,
          helpers: {
            show: true,
            color: BASE_TEXT_COLOUR
          },
          closeIcon: {
            color: BASE_TEXT_COLOUR,
            position: 'top-right',
            size: '2.5em'
          },
          background: {
            background: 'lightsalmon',
            backgroundImg: 'unset'
          },
          padding: '1em',
          button: {
            font: {
              ...DEFAULT_FONT_PROPS,
              color: BASE_TEXT_COLOUR,
              size: '1.5em',
              weight: 300,
              textTransform: 'uppercase'
            },
            background: {
              background: BASE_TEXT_COLOUR,
              backgroundImg: 'unset',
              connected: 'darkpurple'
            },
            border: {
              border: '1px solid black',
              color: 'none',
              radius: '1em'
            },
            walletIcons: {
              height: '100%',
              maxHeight: '64%',
              filter: 'none'
            },
            hoverAnimations: true
          }
        },
        account: {
          ...DEFAULT_BASE_MODAL_PROPS,
          balanceAndAddressContainer: {
            background: {
              backgroundImg: 'none',
              background: '#370937c9'
            }
          }
        }
      }
    }
  }
}
export default PstlModalTheme
