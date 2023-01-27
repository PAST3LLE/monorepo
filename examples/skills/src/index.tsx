import { FontCssProvider, StaticGlobalCssProvider, ThemeProvider, ThemedGlobalCssProvider } from '@past3lle/theme'
import * as React from 'react'
import 'react-app-polyfill/ie11'
import * as ReactDOM from 'react-dom/client'

import { WindowSizeUpdater } from './state/WindowSize/udpaters'
import { CUSTOM_THEME } from './theme/customTheme'
import { GothicFontCssProvider } from './theme/fonts'
import { CustomStaticGlobalCss, CustomThemeGlobalCss } from './theme/global'
import { SkilltreeView } from './views/SkilltreeView'

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
  <React.StrictMode>
    {/* UPDATERS */}
    <WindowSizeUpdater />
    {/* THEME PROVIDERS */}
    <GothicFontCssProvider />
    <FontCssProvider />
    <StaticCssProviders />
    <ThemeProvider themeExtension={CUSTOM_THEME}>
      <ThemedCssProviders />
      <SkilltreeView />
    </ThemeProvider>
  </React.StrictMode>
)
