import { ThemeByModes } from '@past3lle/theme'

import { PstlModalThemeExtension } from './types'

const BASE_TEXT_COLOUR = 'ghostwhite'
const PstlModalTheme: ThemeByModes<PstlModalThemeExtension> = {
  modes: {
    LIGHT: {},
    DARK: {},
    DEFAULT: {
      modals: {
        connection: {
          filter: 'none',
          baseFontSize: 16,
          helpers: {
            show: true,
            color: BASE_TEXT_COLOUR
          },
          closeIcon: {
            color: BASE_TEXT_COLOUR,
            position: 'top-right',
            size: '2.5em'
          },
          title: {
            color: BASE_TEXT_COLOUR,
            fontSize: '2em',
            fontWeight: 700,
            letterSpacing: '0px',
            lineHeight: 1
          },
          backgroundImg: 'unset',
          backgroundColor: 'lightsalmon',
          padding: '1em',
          button: {
            color: BASE_TEXT_COLOUR,
            textShadow: 'none',
            backgroundImg: 'unset',
            backgroundColor: BASE_TEXT_COLOUR,
            connectedBackgroundColor: 'darkpurple',
            fontSize: '1.5em',
            fontStyle: 'inherit',
            fontWeight: 300,
            letterSpacing: '0px',
            textTransform: 'uppercase',
            border: {
              border: '1px solid black',
              color: 'none',
              radius: '1em'
            },
            hoverAnimations: true
          }
        },
        account: {
          balanceAndAddressContainer: {
            backgroundColor: '#370937c9'
          }
        }
      }
    }
  }
}
export default PstlModalTheme
