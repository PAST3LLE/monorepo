import { SkilltreeBoardConnected, SkilltreeBoardConnectedProps, SkilltreeHeader } from '@past3lle/skilltree-widget'
import { createTemplateTheme, FontCssProvider } from '@past3lle/theme'
import { ASSETS_MAP } from 'assets'
import React from 'react'
import { GothicFontCssProvider } from 'theme/fonts'

const skilltreeTheme = createTemplateTheme('SKILLTREE', {
  DEFAULT: {
    assetsMap: ASSETS_MAP
  }
})

const SKILLTREE_CONFIG: SkilltreeBoardConnectedProps = {
  config: {
    appName: 'PSTL SKILLTREE',
    appTheme: skilltreeTheme,
    provider: {
      projectId: process.env.REACT_APP_WALLETCONNECT_KEY || 'BROKEN'
    }
  }
}

export function App() {
  return (
    <SkilltreeBoardConnected config={SKILLTREE_CONFIG.config}>
      <FontCssProvider />
      <GothicFontCssProvider />
      <SkilltreeHeader />
    </SkilltreeBoardConnected>
  )
}
