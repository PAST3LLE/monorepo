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
    height: '70%',
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
            },
            margin: '0 20px'
          },
          input: {
            font: DEFAULT_FONT_PROPS,
            border: {
              radius: '0.3em',
              border: '1px solid rgba(255 255 255 / 45%)',
              color: 'rgba(255 255 255 / 45%)'
            },
            background: {
              background: 'transparent',
              backgroundImg: 'none'
            }
          },
          error: {
            font: {
              color: 'ghostwhite'
            },
            background: {
              background: '#000000de'
            }
          },
          helpers: {
            show: true,
            font: { color: BASE_TEXT_COLOUR, size: '0.55em' }
          },
          closeIcon: {
            color: BASE_TEXT_COLOUR,
            size: 40,
            background: {
              background: 'transparent'
            }
          },
          background: {
            background: '#8984cfeb',
            backgroundImg: 'unset'
          },
          padding: '1em'
        },
        connection: {
          ...DEFAULT_BASE_MODAL_PROPS,
          button: {
            ...DEFAULT_BUTTON_PROPS,
            height: '90px'
          }
        },
        hidDevice: {
          container: {
            main: {
              background: {
                backgroundImg: 'unset',
                background: '#292531e3'
              },
              border: DEFAULT_BUTTON_PROPS.border
            },
            addressesList: {
              background: {
                backgroundImg: 'unset',
                background: '#f8f8ff2e'
              },
              border: DEFAULT_BUTTON_PROPS.border
            }
          }
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
          connectionImages: {
            size: '3.5em',
            background: {
              background: 'rgba(0,0,0,0.5)'
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
