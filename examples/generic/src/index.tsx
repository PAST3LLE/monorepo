import { FontCssProvider, StaticGlobalCssProvider, ThemeProvider } from '@past3lle/theme'
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

const container = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(container)

root.render(
  <>
    <FontCssProvider />
    <StaticCssProviders />
    <ThemeProvider themeExtension={{}}>
      <App />
    </ThemeProvider>
  </>
)
