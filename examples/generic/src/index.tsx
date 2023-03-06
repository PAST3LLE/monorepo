import { ThemeChangerButton } from '@past3lle/skilltree-widget'
import {
  FontCssProvider,
  StaticGlobalCssProvider,
  ThemeProvider,
  createCustomTheme,
  getThemeColourByKeyCurried,
  getThemeColoursCurried,
  urlToSimpleGenericImageSrcSet
} from '@past3lle/theme'
import * as React from 'react'
import 'react-app-polyfill/ie11'
import * as ReactDOM from 'react-dom/client'

import THEME_BUTTON_IMAGE from './assets/pixelated-shirt.png'
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
    DEFAULT: {
      red1: 'red',
      red2: 'orange'
    },
    DARK: {
      red1: 'indianred',
      red2: 'darkred'
    },
    LIGHT: {}
  }
})

/**
 * Curried theme functions to get theme items
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const red1 = getThemeColourByKeyCurried(appTheme)('DARK', 'red1', 'red')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const themeDark = getThemeColoursCurried(appTheme)('DARK')

const container = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(container)

function AppControl() {
  return (
    <>
      {/* We need a top level ThemeProvider from @past3lle to feed components proper default theme */}
      <ThemeProvider theme={appTheme} defaultMode="DARK">
        <App />
        <ThemeChangerButton
          label="Change Skilltree Theme"
          backgroundColor={'springgreen'}
          bgBlendMode="exclusion"
          bgAttributes={['center / cover no-repeat', '5px / cover repeat']}
          bgImage={urlToSimpleGenericImageSrcSet(THEME_BUTTON_IMAGE)}
        />
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
