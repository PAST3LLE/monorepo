import { createCustomTheme } from '@past3lle/theme'

import { chains } from '../connectors/config'
import { PstlW3ProviderProps } from '../providers'

const pstlModalTheme = createCustomTheme({
  modes: {
    LIGHT: {},
    DARK: {},
    DEFAULT: {
      content: {
        modals: {
          connection: {
            button: {
              background: 'rgb(196 152 152 / 90%)',
              border: { border: '1px solid #e6b8b8' },
              color: '#373131',
              fontStyle: 'normal',
              fontWeight: 600,
              letterSpacing: '-1px',
              textShadow: '2px 2px 3px #0000005c',
              textTransform: 'uppercase'
            }
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
    w3aId: WEB3AUTH_TEST_ID,
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
    modalTheme: pstlModalTheme
  }
}

export { WALLETCONNECT_TEST_ID as wcId, DEFAULT_PROPS as commonProps }
