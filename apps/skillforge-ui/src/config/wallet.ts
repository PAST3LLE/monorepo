import { createCustomTheme, ThemeByModes } from '@past3lle/theme'
import { PstlModalTheme } from '@past3lle/web3-modal'
import { ASSETS_MAP } from 'assets'

export const pstlModalTheme = createCustomTheme<ThemeByModes<PstlModalTheme>>({
  modes: {
    LIGHT: {},
    DARK: {},
    DEFAULT: {
      modals: {
        connection: {
          background: `url(${ASSETS_MAP.images.background.app}) center/cover`,
          baseFontSize: 20,
          helpers: { show: true },
          closeIcon: {
            size: '40px'
          },
          title: { color: '#cbb9ee', fontWeight: 700, letterSpacing: '-1.4px', lineHeight: 0.82 },
          button: {
            background: '#301d4ea1',
            connectedBackgroundColor: '#37b9927d',
            border: { border: 'none', radius: '1em' },
            color: 'ghostwhite',
            fontStyle: 'normal',
            fontWeight: 200,
            letterSpacing: '-1px',
            textShadow: '2px 2px 3px #0000005c',
            textTransform: 'uppercase',
            hoverAnimations: true
          }
        }
      }
    }
  }
})
