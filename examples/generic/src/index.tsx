import { ThemeChangerButton } from '@past3lle/skilltree-widget'
import { FontCssProvider, StaticGlobalCssProvider, ThemeProvider, createCustomTheme } from '@past3lle/theme'
import * as React from 'react'
import 'react-app-polyfill/ie11'
import * as ReactDOM from 'react-dom/client'

import { PstlStaticGlobalCss } from './styles/global'
import { App } from './views/App'

const StaticCssProviders = () => (
  <>
    <StaticGlobalCssProvider />
    <PstlStaticGlobalCss />
  </>
)

const appTheme = createCustomTheme({
  modes: {
    DEFAULT: {},
    DARK: {},
    LIGHT: {}
  }
})

const container = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(container)

function AppControl() {
  return (
    <>
      {/* We need a top level ThemeProvider from @past3lle to feed components proper default theme */}
      <ThemeProvider theme={appTheme}>
        <App />
        <ThemeChangerButton color={'white'} label="Change Skilltree Theme" />
      </ThemeProvider>
    </>
  )
}

root.render(
  <>
    <FontCssProvider />
    <StaticCssProviders />
    <AppControl />
  </>
)
