import { ThemeByModes, createCustomTheme } from '@past3lle/theme'

import { chains } from '../connectors/config'
import { PstlW3ProviderProps } from '../providers'
import { Theme } from '../theme/types'

const BG_LOGO =
  'https://raw.githubusercontent.com/PAST3LLE/monorepo/main/apps/skillforge-ui/src/assets/png/background.png'
const pstlModalTheme = createCustomTheme<ThemeByModes<Theme>>({
  modes: {
    LIGHT: {},
    DARK: {},
    DEFAULT: {
      modals: {
        connection: {
          background: `url(${BG_LOGO}) center/cover`,
          title: { color: '#cbb9ee', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-1.4px', lineHeight: 0.72 },
          button: {
            background: '#301d4ea1',
            border: { border: 'none', radius: '1rem' },
            color: 'ghostwhite',
            fontStyle: 'italic',
            fontWeight: 600,
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

// TESTING ID - DONT USE IN PROD
const WALLETCONNECT_TEST_ID = 'a01e2f3b7c64ff495f9cb28e4e2d4b49'
// TESTING KEY DO NOT USE IN PROD
const WEB3AUTH_TEST_ID = 'BHloyoLW113nGn-mIfeeNqj2U0wNCXa4y83xLnR6d3FELPMz_oZ7rbY4ZEO3r0MVjQ_LX92obu1ta0NknOwfvtU'
const DEFAULT_PROPS: PstlW3ProviderProps = {
  appName: 'COSMOS APP',
  chains,
  web3Modal: {
    w3mId: WALLETCONNECT_TEST_ID,
    walletImages: {
      web3auth: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
      safe: 'https://user-images.githubusercontent.com/3975770/212338977-5968eae5-bb1b-4e71-8f82-af5282564c66.png'
    },
    themeVariables: {
      '--w3m-z-index': '99999'
    }
  },
  web3Auth: {
    appName: 'SKILLFORGE TEST',
    w3aId: WEB3AUTH_TEST_ID
  },
  pstlW3Modal: {
    modalTheme: pstlModalTheme,
    loaderProps: {
      spinnerProps: {
        size: 80
      }
    }
  }
}

export { WALLETCONNECT_TEST_ID as wcId, DEFAULT_PROPS as commonProps }
