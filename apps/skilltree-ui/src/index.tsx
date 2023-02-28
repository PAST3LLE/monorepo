import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { FontCssProvider, StaticGlobalCssProvider, ThemeProvider, ThemedGlobalCssProvider } from '@past3lle/theme'
import { AtomsDevtools } from 'dev/devTools'
import React, { StrictMode } from 'react'
import 'react-app-polyfill/ie11'
import ReactDOM from 'react-dom/client'
import reportWebVitals from 'reportWebVitals'
import { MetadataUpdater } from 'state/Metadata/updaters/MetadataUpdater'
import { SidePanelUpdater } from 'state/SidePanel/updater'
import { SkillsUpdaters } from 'state/Skills/updaters'
import { UserBalancesUpdater } from 'state/User/updaters'
import { WindowSizeUpdater } from 'state/WindowSize/updaters'
import { CUSTOM_THEME } from 'theme/customTheme'
import { GothicFontCssProvider } from 'theme/fonts'
import { CustomStaticGlobalCss, CustomThemeGlobalCss } from 'theme/global'
import { SkilltreeView } from 'views/SkilltreeView'
import { WagmiProvider, Web3Modal } from 'web3/config'

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

const container = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(container)

root.render(
  <StrictMode>
    <Web3Modal />
    <WagmiProvider>
      {/* @ts-ignore */}
      <AtomsDevtools>
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
        <ThemeProvider themeExtension={CUSTOM_THEME}>
          <ThemedCssProviders />
          <SidePanelUpdater />
          <SkilltreeView />
        </ThemeProvider>
      </AtomsDevtools>
    </WagmiProvider>
  </StrictMode>
)

// SERVICE WORKER (e.g USER OFFLINE USE)
// README: change to unregister to remove SW
serviceWorkerRegistration.register()

// WEB VITALS REPORTING
// README: change to unregister to remove web vitals reporting
reportWebVitals()
