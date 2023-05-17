import { ColumnCenter, RowProps } from '@past3lle/components'
import { StaticGlobalCssProvider, ThemedGlobalCssProvider } from '@past3lle/theme'
import React, { ReactNode, StrictMode, useMemo } from 'react'
import { useTheme } from 'styled-components'

import { SkillForgeConnectedDataProviders, SkillForgeDisconnectedDataProviders } from '../state'
import { CustomStaticGlobalCss, CustomThemeGlobalCss } from '../theme/global'
import { SkillForgeWidgetConfig } from '../types/appConfig'
import { SkillForge as SkillForgeComponent } from './Board'
import {
  ConnectionInfoButton,
  InventoryButton,
  NetworkInfoButton,
  OpenWeb3ModalButton,
  ShopExternalLinkButton,
  ThemeChangerButton
} from './Common/Button'
import { SkillForgeHeader as SkillForgeConnectedHeader } from './Header'

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

interface SkillForgeProps {
  config: SkillForgeWidgetConfig
}

/**
 * @name SkillForge
 * @description Connected version of the base SkillForge component. Attaches Web3/Wagmi providers
 * @param SkillForgeProps
 * @example
    interface SkillForgeProps: {
      config: {
        appName: string
        appTheme: SkillForgeThemeByModes // --> see type SkillForgeTheme
        provider: {
          projectId: string
        }
      }
    }
 */
function SkillForge({ config, children, ...boxProps }: SkillForgeProps & RowProps & { children?: ReactNode }) {
  const Provider = useMemo(
    () => (config.web3.standalone ? SkillForgeDisconnectedDataProviders : SkillForgeConnectedDataProviders),
    [config.web3.standalone]
  )
  return (
    <StrictMode>
      <Provider {...config}>
        <CssProviders />
        <ColumnCenter
          // Default
          height="100%"
          margin="auto"
          justifyContent="center"
          // User passed in props
          {...boxProps}
        >
          {children}
          <SkillForgeComponent {...boxProps} options={config.skillOptions} />
        </ColumnCenter>
      </Provider>
    </StrictMode>
  )
}

export {
  // Core comps
  SkillForge,
  SkillForgeComponent,
  SkillForgeConnectedHeader,
  // Buttons
  InventoryButton,
  NetworkInfoButton,
  ThemeChangerButton,
  OpenWeb3ModalButton,
  ConnectionInfoButton,
  ShopExternalLinkButton,
  // Types
  type SkillForgeProps
}
