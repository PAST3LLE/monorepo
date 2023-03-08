import { ForgeWeb3Providers } from '@past3lle/forge-web3'
import { StaticGlobalCssProvider, ThemedGlobalCssProvider } from '@past3lle/theme'
import React, { ReactNode, StrictMode } from 'react'
import { useTheme } from 'styled-components'

import { SkilltreeCoreUpdaters } from '../state'
import { CustomStaticGlobalCss, CustomThemeGlobalCss } from '../theme/global'
import { AppConfig } from '../types/appConfig'
import { SkilltreeBoard as SkilltreeBoardComponent } from './Board'
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
        backgroundImage={assetsMap.images.background.app}
        lockedSkillIcon={assetsMap.icons.locked}
      />
      <ThemedGlobalCssProvider />
      <CustomThemeGlobalCss />
    </>
  )
}

interface SkilltreeBoardConnectedProps {
  config: AppConfig
}

interface SkilltreeBoardProps {
  config: Omit<AppConfig, 'provider'>
}

/**
 * @name SkilltreeBoardConnected
 * @description Connected version of the base SkilltreeBoard component. Attaches Web3/Wagmi providers
 * @param config - configuration object:
 * @example
 * // PROPS
    interface SkilltreeBoardConnectedProps: {
      config: {
        appName: string
        appTheme: SkilltreeThemeByModes // --> see type SkilltreeTheme
        provider: {
          projectId: string
        }
      }
    }
 */
function SkilltreeBoardConnected({ config, children }: SkilltreeBoardConnectedProps & { children?: ReactNode }) {
  return (
    <StrictMode>
      <ForgeWeb3Providers
        walletconnectConfig={{
          appName: config.name,
          walletConnect: config.provider
        }}
      >
        <SkilltreeCoreUpdaters {...config}>
          <CssProviders />
          {children}
          <SkilltreeBoardComponent />
        </SkilltreeCoreUpdaters>
      </ForgeWeb3Providers>
    </StrictMode>
  )
}

/**
 * @name SkilltreeBoard
 * @description Base version of the base SkilltreeBoard component. Requires wrapping with Web3/Wagmi providers
 * @param config - configuration object:
 * @example
 * // PROPS
    interface SkilltreeBoardBaseProps: {
      config: {
        appName: string
        appTheme: SkilltreeThemeByModes // --> see type SkilltreeTheme
        provider: {
          projectId: string
        }
      }
    }
 */
function SkilltreeBoard({ config, children }: SkilltreeBoardProps & { children?: ReactNode }) {
  return (
    <StrictMode>
      <SkilltreeCoreUpdaters {...config}>
        <CssProviders />
        {children}
        <SkilltreeBoardComponent />
      </SkilltreeCoreUpdaters>
    </StrictMode>
  )
}

export {
  // Core
  SkilltreeBoardConnected,
  SkilltreeBoard,
  SkilltreeBoardComponent,
  SkilltreeHeader,
  // Buttons
  ConnectionInfoButton,
  InventoryButton,
  NetworkInfoButton,
  OpenWeb3ModalButton,
  ShopExternalLinkButton,
  ThemeChangerButton,
  // Types
  type SkilltreeBoardConnectedProps,
  type SkilltreeBoardProps
}
