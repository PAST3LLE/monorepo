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
          baseFontSize: 16,
          helpers: {
            show: true,
            color: BASE_TEXT_COLOUR
          },
          closeIcon: {
            color: BASE_TEXT_COLOUR,
            position: 'top-right',
            size: '2.5rem'
          },
          title: {
            color: BASE_TEXT_COLOUR,
            fontSize: '2rem',
            fontWeight: 700,
            letterSpacing: '0px',
            lineHeight: 1
          },
          backgroundImg: 'unset',
          backgroundColor: 'lightsalmon',
          padding: '1rem',
          button: {
            color: BASE_TEXT_COLOUR,
            textShadow: 'none',
            backgroundImg: 'unset',
            backgroundColor: BASE_TEXT_COLOUR,
            connectedBackgroundColor: 'darkpurple',
            fontSize: '1.5rem',
            fontStyle: 'inherit',
            fontWeight: 300,
            letterSpacing: '0px',
            textTransform: 'uppercase',
            border: {
              border: '1px solid black',
              color: 'none',
              radius: '1rem'
            },
            hoverAnimations: true
          }
        }
      }
    }
  }
}
export default PstlModalTheme
