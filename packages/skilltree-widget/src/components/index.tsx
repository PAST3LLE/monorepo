import { StaticGlobalCssProvider, ThemeProvider, ThemedGlobalCssProvider } from '@past3lle/theme'
import React, { StrictMode } from 'react'

import { AtomsDevtools } from '../dev/devTools'
import { MetadataUpdater } from '../state/Metadata/updaters/MetadataUpdater'
import { SidePanelUpdater } from '../state/SidePanel/updater'
import { SkillsUpdaters } from '../state/Skills/updaters'
import { UserBalancesUpdater } from '../state/User/updaters'
import { WindowSizeUpdater } from '../state/WindowSize/updaters'
import { CustomStaticGlobalCss, CustomThemeGlobalCss } from '../theme/global'
import { AppConfig } from '../types/appConfig'
import { Web3ModalAndWagmiProvider } from '../web3/config'
import { SkilltreeBoard } from './SkilltreeBoard'

interface StaticCssProps {
  backgroundImage: string
  lockedSkillIcon: string
}
const StaticCssProviders = (props: StaticCssProps) => (
  <>
    <StaticGlobalCssProvider />
    <CustomStaticGlobalCss {...props} />
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
      <Web3ModalAndWagmiProvider
        clientProps={{
          appName: config.appName,
          walletConnect: config.provider
        }}
      >
        {/* @ts-ignore */}
        <AtomsDevtools appName={config.appName}>
          {/* UPDATERS */}
          <MetadataUpdater />
          <UserBalancesUpdater />
          <SkillsUpdaters />
          <WindowSizeUpdater />
          {/* THEME PROVIDERS */}
          <StaticCssProviders
            backgroundImage={config.appTheme.modes.DEFAULT.assetsMap.images.appBackground}
            lockedSkillIcon={config.appTheme.modes.DEFAULT.assetsMap.icons.locked}
          />
          <ThemeProvider theme={config.appTheme}>
            <ThemedCssProviders />
            <SidePanelUpdater />
            <SkilltreeBoard />
          </ThemeProvider>
        </AtomsDevtools>
      </Web3ModalAndWagmiProvider>
    </StrictMode>
  )
}

export { PastelleSkilltree, PastelleSkilltreeProps, SkilltreeBoard }
