import { ColumnCenter, RowProps } from '@past3lle/components'
import { ForgeChainsMinimum, SupportedForgeChainIds, useSupportedChainId } from '@past3lle/forge-web3'
import { useIsMobile } from '@past3lle/hooks'
import { StaticGlobalCssProvider, ThemedGlobalCssProvider } from '@past3lle/theme'
import React, { useMemo } from 'react'
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
      <CustomStaticGlobalCss />
      <ThemedGlobalCssProvider />
      <CustomThemeGlobalCss
        backgroundImage={assetsMap.images.background.app}
        lockedSkillIcon={assetsMap.icons.locked}
      />
    </>
  )
}

const InnerRenderComponent = ({
  render
}: {
  render?: ({ chainId }: { chainId: SupportedForgeChainIds | undefined }) => React.ReactElement<any, any>
}) => {
  const chainId = useSupportedChainId()
  if (!render) {
    return null
  }
  return render({ chainId })
}

function SkillforgeInnerComponent<chains extends ForgeChainsMinimum>({
  render,
  dimensions,
  ...boxProps
}: Omit<SkillForgeProps<chains>, 'config'>) {
  const isMobile = useIsMobile()
  const dynamicDimensions = useMemo(
    () => ({
      maxWidth: isMobile ? dimensions?.mobile?.width?.max || '100%' : dimensions?.desktop?.width?.max || '90%',
      maxHeight: isMobile ? dimensions?.mobile?.height?.max : dimensions?.desktop?.height?.max,
      minWidth: isMobile ? dimensions?.mobile?.width?.min : dimensions?.desktop?.width?.min,
      minHeight: isMobile ? dimensions?.mobile?.height?.min : dimensions?.desktop?.height?.min,
      height: (isMobile ? dimensions?.mobile?.height?.base : dimensions?.desktop?.height?.base) || '100%',
      width: (isMobile ? dimensions?.mobile?.width?.base : dimensions?.desktop?.width?.base) || '100%'
    }),
    [
      dimensions?.desktop?.height?.base,
      dimensions?.desktop?.height?.max,
      dimensions?.desktop?.height?.min,
      dimensions?.desktop?.width?.base,
      dimensions?.desktop?.width?.max,
      dimensions?.desktop?.width?.min,
      dimensions?.mobile?.height?.base,
      dimensions?.mobile?.height?.max,
      dimensions?.mobile?.height?.min,
      dimensions?.mobile?.width?.base,
      dimensions?.mobile?.width?.max,
      dimensions?.mobile?.width?.min,
      isMobile
    ]
  )
  return (
    <ColumnCenter
      // Default
      {...dynamicDimensions}
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
interface SkillForgeProps<chains extends ForgeChainsMinimum> extends RowProps {
  config: SkillForgeWidgetConfig<chains>
  dimensions?: SkillforgeDimensions
  render?: ({ chainId }: { chainId: SupportedForgeChainIds | undefined }) => React.ReactElement<any, any>
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
function SkillForge<chains extends ForgeChainsMinimum>({ config, render, ...boxProps }: SkillForgeProps<chains>) {
  const [Provider, modifiedConfig] = useConfigMiddleware<chains>(config)

  return (
    <Provider {...modifiedConfig}>
      <CssProviders />
      <SkillforgeInnerComponent {...boxProps} render={render} />
    </Provider>
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
