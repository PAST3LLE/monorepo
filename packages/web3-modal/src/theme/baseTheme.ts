import { ThemeByModes } from '@past3lle/theme'
import { DeepRequired } from '@past3lle/types'

import { PstlModalThemeExtension, SharedModalTheme } from './types'

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
const DEFAULT_BUTTON_PROPS: DeepRequired<SharedModalTheme>['button']['main'] = {
  filter: 'unset',
  height: 'auto',
  font: {
    ...DEFAULT_FONT_PROPS,
    color: BASE_TEXT_COLOUR,
    size: '1.5em',
    weight: 300,
    textTransform: 'uppercase'
  },
  background: { default: '#383e3d', url: 'none' },
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

const DEFAULT_BUTTON_FONT_PROPS = {
  ...DEFAULT_FONT_PROPS,
  color: BASE_TEXT_COLOUR,
  size: '1em',
  weight: 300,
  textTransform: 'uppercase'
} as const

const DEFAULT_ACCOUNT_BUTTON_BACKGROUND_PROPS = {
  font: DEFAULT_BUTTON_FONT_PROPS,
  background: { default: DEFAULT_BUTTON_PROPS.background.default, url: 'none' },
  border: DEFAULT_BUTTON_PROPS.border
} as const

const MAIN_COLOURS = {
  main: '#4f6d6beb',
  secondary: '#383e3d',
  alternate: 'rgba(0,0,0,0.5)',
  success: '#8576f2cc',
  error: '#7f1d1db0',
  warning: 'navajowhite',
  url: 'unset'
}

const PstlModalTheme: ThemeByModes<PstlModalThemeExtension> = {
  modes: {
    LIGHT: {},
    DARK: {},
    DEFAULT: {
      modals: {
        base: {
          ...DEFAULT_BASE_MODAL_PROPS,
          font: DEFAULT_FONT_PROPS,
          button: {
            main: DEFAULT_BUTTON_PROPS,
            secondary: {
              ...DEFAULT_BUTTON_PROPS,
              background: {
                default: 'coral',
                url: 'none'
              }
            },
            alternate: {
              ...DEFAULT_BUTTON_PROPS,
              background: { default: 'navajowhite', url: 'none' }
            },
            active: {
              ...DEFAULT_BUTTON_PROPS,
              filter: 'invert(1) saturate(1.2)',
              background: { default: MAIN_COLOURS.success, url: 'none' }
            },
            disabled: {
              ...DEFAULT_BUTTON_PROPS,
              background: { default: 'darkgrey', url: 'none' },
              font: { ...DEFAULT_BUTTON_PROPS.font, color: 'grey' }
            }
          },
          container: {
            main: {
              background: 'navajowhite',
              border: DEFAULT_BUTTON_PROPS.border
            },
            secondary: {
              background: 'slategray',
              border: DEFAULT_BUTTON_PROPS.border
            },
            alternate: {
              background: 'coral',
              border: DEFAULT_BUTTON_PROPS.border
            }
          },
          text: {
            main: DEFAULT_FONT_PROPS,
            header: {
              ...DEFAULT_FONT_PROPS,
              textTransform: 'uppercase',
              size: '1.4em',
              weight: 600,
              letterSpacing: '-1px'
            },
            subHeader: {
              ...DEFAULT_FONT_PROPS,
              color: '#bebebe',
              textTransform: 'uppercase',
              size: '1.2em',
              weight: 100,
              letterSpacing: '-1px'
            },
            small: {
              ...DEFAULT_FONT_PROPS,
              weight: 500,
              size: '0.7em'
            },
            error: {
              ...DEFAULT_FONT_PROPS,
              color: '#7f1d1db0',
              textTransform: 'uppercase',
              weight: 300
            },
            warning: {
              ...DEFAULT_FONT_PROPS,
              color: 'navajowhite',
              textTransform: 'uppercase',
              weight: 300
            }
          },
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
            background: 'transparent'
          },
          error: {
            font: {
              color: 'ghostwhite'
            },
            background: 'black' || '#000000de'
          },
          helpers: {
            show: true,
            font: { color: BASE_TEXT_COLOUR, size: '0.7em' }
          },
          closeIcon: {
            color: BASE_TEXT_COLOUR,
            size: 40,
            background: 'transparent'
          },
          background: MAIN_COLOURS,

          padding: '1em'
        },
        connection: {
          ...DEFAULT_BASE_MODAL_PROPS,
          button: {
            main: {
              ...DEFAULT_BUTTON_PROPS,
              height: '90px'
            }
          }
        },
        hidDevice: {
          container: {
            main: {
              background: MAIN_COLOURS.main,
              border: DEFAULT_BUTTON_PROPS.border
            },
            secondary: {
              background: MAIN_COLOURS.secondary,
              border: DEFAULT_BUTTON_PROPS.border
            },
            alternate: {
              background: MAIN_COLOURS.alternate,
              border: DEFAULT_BUTTON_PROPS.border
            }
          }
        },
        account: {
          ...DEFAULT_BASE_MODAL_PROPS,
          container: {
            main: {
              border: DEFAULT_BUTTON_PROPS.border,
              background: DEFAULT_BUTTON_PROPS.background.default
            },
            alternate: {
              border: DEFAULT_BUTTON_PROPS.border,
              background: DEFAULT_BUTTON_PROPS.background.default
            }
          },
          connectionImages: {
            size: '3.5em',
            background: 'rgba(0,0,0,0.5)'
          },
          text: {
            main: {
              ...DEFAULT_BUTTON_FONT_PROPS,
              size: '1.2em'
            }
          },
          icons: {
            wallet: { url: '', invert: false },
            network: { url: '', invert: false },
            copy: { url: '', invert: false }
          },
          button: {
            alternate: {
              border: DEFAULT_BUTTON_PROPS.border,
              font: DEFAULT_BUTTON_FONT_PROPS,
              background: { default: '#7b2727b0', url: 'none' }
            },
            main: {
              ...DEFAULT_ACCOUNT_BUTTON_BACKGROUND_PROPS,
              background: {
                default: MAIN_COLOURS.main,
                url: 'none'
              }
            }
          }
        }
      }
    }
  }
}

export default PstlModalTheme
