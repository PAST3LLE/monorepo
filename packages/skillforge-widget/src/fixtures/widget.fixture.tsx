import { useW3Connection, useW3Modal } from '@past3lle/forge-web3'
import React from 'react'

import { SkillForge } from '../components'
import { SkillForgeHeader } from '../components/Header'
import { createTheme } from '../theme/utils'
import { commonProps, contractProps } from './config'

/* 
    interface Web3ModalProps {
        appName: string
        web3Modal: Web3ModalConfig
        wagmiClient?: SkillForgeW3WagmiClientOptions
        ethereumClient?: EthereumClient
    }
*/

function InnerApp() {
  const { open } = useW3Modal()
  const [, , { address }] = useW3Connection()

  return (
    <div>
      <button onClick={() => open({ route: address ? 'Account' : 'ConnectWallet' })}>Open Pstl Web3 Modal</button>
      <h1>{address || 'Disconnected'}</h1>
    </div>
  )
}

const skillforgeTheme = createTheme({
  ALT: {
    mainBgAlt: '#1A1A1A',
    assetsMap: {
      logos: {
        company: { full: 'COMPANY_LOGO' },
        forge: { '512': 'FORGE_512' }
      }
    }
  },
  DEFAULT: {
    assetsMap: {
      logos: {
        company: { full: 'COMPANY_LOGO' },
        forge: { '512': 'FORGE_512' }
      },
      images: {
        background: {
          app: 'https://ik.imagekit.io/pastelle/SKILLFORGE/forge-background.png',
          header: {
            background: 'HEADER_BACKGROUND',
            account: 'ACCOUNT_BACKGROUND'
          }
        },
        skills: {
          skillpoint: {
            highlight: 'HIGHLIGHT',
            empty: 'EMPTY_SKILL'
          }
        }
      },
      icons: {
        locked: 'LOCK_ICON',
        connection: 'CONNECTION_ICON',
        inventory: 'INVENTORY_ICON',
        shop: 'SHOP_ICON',
        chains: {
          disconnected: 'CONNECTION_ICON',
          5: 'ETHEREUM_LOGO',
          80001: 'POLYGON_LOGO'
        },
        rarity: {
          empty: '',
          common: 'COMMON_RARITY_ICON',
          rare: 'RARE_RARITY_ICON',
          legendary: 'LEGENDARY_RARITY_ICON',
          epic: 'EPIC_RARITY_ICON'
        }
      }
    }
  }
})
function App() {
  return (
    <SkillForge
      config={{
        ...contractProps,
        name: 'Skillforge Widget Fixture',
        theme: skillforgeTheme,
        web3: {
          chains: commonProps.chains,
          modals: {
            w3m: commonProps.modals.w3m,
            w3a: commonProps.modals.w3a
          }
        }
      }}
    >
      <SkillForgeHeader />
      <InnerApp />
    </SkillForge>
  )
}

export default {
  default: <App />
}
