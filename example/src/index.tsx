import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import { ThemeProvider, StaticGlobalCssProvider } from '@past3lle-schematics/theme'

import { App } from './views/App'
import { PstlStaticGlobalCss } from './styles/global'

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
    <StaticCssProviders />
    <ThemeProvider themeExtension={{}}>
      <App />
    </ThemeProvider>
  </>
)
