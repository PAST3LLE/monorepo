import { Text } from '@past3lle/components'
import { FontCssProvider, StaticGlobalCssProvider, ThemeProvider } from '@past3lle/theme'
import * as React from 'react'
import 'react-app-polyfill/ie11'
import * as ReactDOM from 'react-dom/client'

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
    <FontCssProvider />
    <StaticCssProviders />
    <ThemeProvider themeExtension={{}}>
      <Text.SubHeader>COLLECTION SKILLS</Text.SubHeader>
      <h1>SKILLTREE</h1>
      <p>Code skilltree UI here</p>
    </ThemeProvider>
  </>
)
