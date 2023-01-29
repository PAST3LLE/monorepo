import { WindowSizeUpdater } from './state/WindowSize/udpaters'
import { CUSTOM_THEME } from './theme/customTheme'
import { GothicFontCssProvider } from './theme/fonts'
import { CustomStaticGlobalCss, CustomThemeGlobalCss } from './theme/global'
import { SkilltreeView } from './views/SkilltreeView'
import { FontCssProvider, StaticGlobalCssProvider, ThemeProvider, ThemedGlobalCssProvider } from '@past3lle/theme'
import { useAtomsDevtools } from 'jotai-devtools'
import React, { ReactNode, StrictMode } from 'react'
import 'react-app-polyfill/ie11'
import ReactDOM from 'react-dom/client'

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

// Attach atoms to redux devtools
const AtomsDevtools = ({ children }: { children: ReactNode }) => {
  useAtomsDevtools('examples-skilltree')
  return children
}

const container = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(container)

root.render(
  <StrictMode>
    {/* @ts-ignore */}
    <AtomsDevtools>
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
    </AtomsDevtools>
  </StrictMode>
)
