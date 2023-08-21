import { BLACK_TRANSPARENT, ThemeByModes } from '@past3lle/theme'

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
  style: 'normal',
  letterSpacing: '-0.5px',
  lineHeight: 1.5,
  textShadow: 'none',
  textTransform: 'none',
  family: 'inherit',
  textAlign: 'initial'
} as const

const DEFAULT_BUTTON_PROPS = {
  font: {
    ...DEFAULT_FONT_PROPS,
    color: BASE_TEXT_COLOUR,
    size: '1.5em',
    weight: 300,
    textTransform: 'uppercase'
  },
  background: {
    background: BLACK_TRANSPARENT,
    backgroundImg: 'unset',
    connected: '#8576f2cc'
  },
  border: {
    border: 'unset',
    radius: '1em',
    color: 'inherit'
  },
  icons: {
    height: '100%',
    maxHeight: '64%',
    filter: 'none'
  },
  hoverAnimations: true
} as const

const DEFAULT_ACCOUNT_BUTTON_FONT_PROPS = {
  ...DEFAULT_FONT_PROPS,
  color: BASE_TEXT_COLOUR,
  size: '1em',
  weight: 300,
  textTransform: 'uppercase'
} as const

const DEFAULT_ACCOUNT_BUTTON_BACKGROUND_PROPS = {
  font: DEFAULT_ACCOUNT_BUTTON_FONT_PROPS,
  background: {
    background: DEFAULT_BUTTON_PROPS.background.connected,
    backgroundImg: DEFAULT_BUTTON_PROPS.background.backgroundImg
  },
  border: DEFAULT_BUTTON_PROPS.border
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
              ...DEFAULT_FONT_PROPS,
              size: '2em',
              weight: 700,
              lineHeight: 1,
              textAlign: 'center'
            }
          },
          helpers: {
            show: true,
            color: BASE_TEXT_COLOUR
          },
          closeIcon: {
            color: BASE_TEXT_COLOUR,
            size: 40
          },
          background: {
            background: '#2a7f70',
            backgroundImg: 'unset'
          },
          padding: '1em'
        },
        connection: {
          ...DEFAULT_BASE_MODAL_PROPS,
          button: DEFAULT_BUTTON_PROPS
        },
        account: {
          ...DEFAULT_BASE_MODAL_PROPS,
          container: {
            addressAndBalance: {
              border: DEFAULT_BUTTON_PROPS.border,
              background: {
                backgroundImg: 'none',
                background: DEFAULT_BUTTON_PROPS.background.background,
                unsupported: '#7f1d1db0'
              }
            },
            walletAndNetwork: {
              border: DEFAULT_BUTTON_PROPS.border,
              background: {
                backgroundImg: 'none',
                background: DEFAULT_BUTTON_PROPS.background.background
              }
            }
          },
          text: {
            main: {
              font: {
                ...DEFAULT_ACCOUNT_BUTTON_FONT_PROPS,
                size: '1.2em'
              }
            },
            balance: {
              font: {
                ...DEFAULT_ACCOUNT_BUTTON_FONT_PROPS,
                color: 'lightgrey',
                size: '1em',
                weight: 100,
                letterSpacing: '-1px'
              }
            },
            address: {
              font: {
                ...DEFAULT_ACCOUNT_BUTTON_FONT_PROPS,
                size: '1.4em',
                weight: 600,
                letterSpacing: '-0.8px'
              }
            }
          },
          icons: {
            wallet: { url: '', invert: false },
            network: { url: '', invert: false },
            copy: { url: '', invert: false }
          },
          button: {
            disconnect: {
              border: DEFAULT_BUTTON_PROPS.border,
              font: DEFAULT_ACCOUNT_BUTTON_FONT_PROPS,
              background: {
                background: '#7b2727b0',
                backgroundImg: 'unset'
              }
            },
            switchNetwork: DEFAULT_ACCOUNT_BUTTON_BACKGROUND_PROPS,
            copy: DEFAULT_ACCOUNT_BUTTON_BACKGROUND_PROPS,
            explorer: DEFAULT_ACCOUNT_BUTTON_BACKGROUND_PROPS
          }
        }
      }
    }
  }
}

export default PstlModalTheme
