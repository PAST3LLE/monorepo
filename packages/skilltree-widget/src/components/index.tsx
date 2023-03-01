import { FontCssProvider, StaticGlobalCssProvider, ThemeProvider, ThemedGlobalCssProvider } from '@past3lle/theme'
import React, { StrictMode } from 'react'
import { AppConfig } from 'src/types'

import { AtomsDevtools } from '../dev/devTools'
import { MetadataUpdater } from '../state/Metadata/updaters/MetadataUpdater'
import { SidePanelUpdater } from '../state/SidePanel/updater'
import { SkillsUpdaters } from '../state/Skills/updaters'
import { UserBalancesUpdater } from '../state/User/updaters'
import { WindowSizeUpdater } from '../state/WindowSize/updaters'
import { GothicFontCssProvider } from '../theme/fonts'
import { CustomStaticGlobalCss, CustomThemeGlobalCss } from '../theme/global'
import { WagmiProvider, Web3Modal } from '../web3/config'
import { SkilltreeBoard } from './SkilltreeBoard'

const StaticCssProviders = () => (
  <>
    <StaticGlobalCssProvider />
    <CustomStaticGlobalCss />
  </>
)

const ThemedCssProviders = () => (
  <>
    <ThemedGlobalCssProvider />
    <CustomThemeGlobalCss />
  </>
)

interface PastelleSkilltreeProps {
  config: AppConfig
}

function PastelleSkilltree({ config }: PastelleSkilltreeProps) {
  return (
    <StrictMode>
      <Web3Modal />
      <WagmiProvider>
        {/* @ts-ignore */}
        <AtomsDevtools appName={config.appName}>
          {/* UPDATERS */}
          <MetadataUpdater />
          <UserBalancesUpdater />
          <SkillsUpdaters />
          <WindowSizeUpdater />
          {/* THEME PROVIDERS */}
          <GothicFontCssProvider />
          <FontCssProvider />
          <StaticCssProviders />
          {/* @ts-ignore */}
          <ThemeProvider themeExtension={{ ...config.appTheme }}>
            <ThemedCssProviders />
            <SidePanelUpdater />
            <SkilltreeBoard />
          </ThemeProvider>
        </AtomsDevtools>
      </WagmiProvider>
    </StrictMode>
  )
}

export {
    PastelleSkilltree,
    PastelleSkilltreeProps,
    SkilltreeBoard
}