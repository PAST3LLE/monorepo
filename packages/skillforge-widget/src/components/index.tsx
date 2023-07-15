import { ColumnCenter, RowProps } from '@past3lle/components'
import { SupportedForgeChains, useSupportedChainId } from '@past3lle/forge-web3'
import { useIsMobile } from '@past3lle/hooks'
import { StaticGlobalCssProvider, ThemedGlobalCssProvider } from '@past3lle/theme'
import React, { StrictMode } from 'react'
import { useTheme } from 'styled-components'

import { useConfigMiddleware } from '../hooks/useConfigMiddleware'
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

const InnerRenderComponent = ({
  render
}: {
  render?: ({ chainId }: { chainId: SupportedForgeChains | undefined }) => React.ReactElement<any, any>
}) => {
  const chainId = useSupportedChainId()
  if (!render) {
    return null
  }
  return render({ chainId })
}

function SkillforgeInnerComponent({ render, dimensions, ...boxProps }: Omit<SkillForgeProps, 'config'>) {
  const isMobile = useIsMobile()
  return (
    <ColumnCenter
      // Default
      maxWidth={isMobile ? dimensions?.mobile?.width?.max || '100%' : dimensions?.desktop?.width?.max || '90%'}
      maxHeight={isMobile ? dimensions?.mobile?.height?.max : dimensions?.desktop?.height?.max}
      minWidth={isMobile ? dimensions?.mobile?.width?.min : dimensions?.desktop?.width?.min}
      minHeight={isMobile ? dimensions?.mobile?.height?.min : dimensions?.desktop?.height?.min}
      height={(isMobile ? dimensions?.mobile?.height?.base : dimensions?.desktop?.height?.base) || '100%'}
      width={(isMobile ? dimensions?.mobile?.width?.base : dimensions?.desktop?.width?.base) || '100%'}
      margin="auto"
      justifyContent="center"
      // User passed in props
      {...boxProps}
    >
      <InnerRenderComponent render={render} />
      <SkillForgeComponent {...boxProps} />
    </ColumnCenter>
  )
}
type MinMaxDimensions = { base?: string; min?: string; max?: string }
interface SkillforgeDimensions {
  mobile?: {
    width?: MinMaxDimensions
    height?: MinMaxDimensions
  }
  desktop?: {
    width?: MinMaxDimensions
    height?: MinMaxDimensions
  }
}
interface SkillForgeProps extends RowProps {
  config: SkillForgeWidgetConfig
  dimensions?: SkillforgeDimensions
  render?: ({ chainId }: { chainId: SupportedForgeChains | undefined }) => React.ReactElement<any, any>
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
function SkillForge({ config, render, ...boxProps }: SkillForgeProps) {
  const [Provider, modifiedConfig] = useConfigMiddleware(config)

  return (
    <StrictMode>
      <Provider {...modifiedConfig}>
        <CssProviders />
        <SkillforgeInnerComponent {...boxProps} render={render} />
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
