import { StaticGlobalCssProvider, ThemedGlobalCssProvider } from '@past3lle/theme'
import React, { StrictMode } from 'react'
import { useTheme } from 'styled-components'

import { SkilltreeCoreUpdaters } from '../state'
import { CustomStaticGlobalCss, CustomThemeGlobalCss } from '../theme/global'
import { AppConfig } from '../types/appConfig'
import { Web3ModalAndWagmiProvider } from '../web3/config'
import { SkilltreeBoard } from './Board'
import {
  ConnectionInfoButton,
  InventoryButton,
  NetworkInfoButton,
  OpenWeb3ModalButton,
  ShopExternalLinkButton,
  ThemeChangerButton
} from './Common/Button'
import { SkilltreeHeader } from './Header'

const CssProviders = () => {
  const { assetsMap } = useTheme()
  return (
    <>
      <StaticGlobalCssProvider />
      <CustomStaticGlobalCss
        backgroundImage={assetsMap.images.appBackground}
        lockedSkillIcon={assetsMap.icons.locked}
      />
      <ThemedGlobalCssProvider />
      <CustomThemeGlobalCss />
    </>
  )
}

interface SkilltreeBoardBaseProps {
  config: AppConfig
}

function SkilltreeBoardConnected({ config }: SkilltreeBoardBaseProps) {
  return (
    <StrictMode>
      <Web3ModalAndWagmiProvider
        clientProps={{
          appName: config.appName,
          walletConnect: config.provider
        }}
      >
        <SkilltreeCoreUpdaters {...config}>
          <CssProviders />
          <SkilltreeBoard />
        </SkilltreeCoreUpdaters>
      </Web3ModalAndWagmiProvider>
    </StrictMode>
  )
}

export {
  SkilltreeBoardConnected,
  SkilltreeBoard,
  SkilltreeHeader,
  // Buttons
  ConnectionInfoButton,
  InventoryButton,
  NetworkInfoButton,
  OpenWeb3ModalButton,
  ShopExternalLinkButton,
  ThemeChangerButton,
  // Types
  type SkilltreeBoardBaseProps
}
