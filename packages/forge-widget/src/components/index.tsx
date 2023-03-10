import { ColumnCenter, RowProps } from '@past3lle/components'
import { StaticGlobalCssProvider, ThemedGlobalCssProvider } from '@past3lle/theme'
import React, { ReactNode, StrictMode, useMemo } from 'react'
import { useTheme } from 'styled-components'

import { SkilltreeConnectedDataProviders, SkilltreeDisconnectedDataProviders } from '../state'
import { CustomStaticGlobalCss, CustomThemeGlobalCss } from '../theme/global'
import { ForgeWidgetAppConfig } from '../types/appConfig'
import { Skilltree as SkilltreeComponent } from './Board'
import {
  ConnectionInfoButton,
  InventoryButton,
  NetworkInfoButton,
  OpenWeb3ModalButton,
  ShopExternalLinkButton,
  ThemeChangerButton
} from './Common/Button'
import { SkilltreeHeader as SkilltreeConnectedHeader } from './Header'

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

interface SkilltreeProps {
  config: ForgeWidgetAppConfig
}

/**
 * @name Skilltree
 * @description Connected version of the base Skilltree component. Attaches Web3/Wagmi providers
 * @param SkilltreeProps
 * @example
    interface SkilltreeProps: {
      config: {
        appName: string
        appTheme: SkilltreeThemeByModes // --> see type SkilltreeTheme
        provider: {
          projectId: string
        }
      }
    }
 */
function Skilltree({ config, children, ...boxProps }: SkilltreeProps & RowProps & { children?: ReactNode }) {
  const Provider = useMemo(
    () => (config.web3.standalone ? SkilltreeDisconnectedDataProviders : SkilltreeConnectedDataProviders),
    [config.web3.standalone]
  )
  return (
    <StrictMode>
      <Provider {...config}>
        <CssProviders />
        <ColumnCenter height="100%" justifyContent="center" margin="auto" {...boxProps}>
          {children}
          <SkilltreeComponent {...boxProps} />
        </ColumnCenter>
      </Provider>
    </StrictMode>
  )
}

export {
  // Core comps
  Skilltree,
  SkilltreeComponent,
  SkilltreeConnectedHeader,
  // Buttons
  InventoryButton,
  NetworkInfoButton,
  ThemeChangerButton,
  OpenWeb3ModalButton,
  ConnectionInfoButton,
  ShopExternalLinkButton,
  // Types
  type SkilltreeProps
}
