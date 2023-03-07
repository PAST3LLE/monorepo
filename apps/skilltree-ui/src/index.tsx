import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { SkilltreeBoardConnected, SkilltreeBoardConnectedProps, SkilltreeHeader } from '@past3lle/skilltree-widget'
import { createTemplateTheme } from '@past3lle/theme'
import { ASSETS_MAP } from 'assets'
import React from 'react'
import 'react-app-polyfill/ie11'
import ReactDOM from 'react-dom/client'
import reportWebVitals from 'reportWebVitals'

const container = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(container)

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

root.render(
  <SkilltreeBoardConnected config={SKILLTREE_CONFIG.config}>
    <SkilltreeHeader />
  </SkilltreeBoardConnected>
)

// SERVICE WORKER (e.g USER OFFLINE USE)
// README: change to unregister to remove SW
serviceWorkerRegistration.register()

// WEB VITALS REPORTING
// README: change to unregister to remove web vitals reporting
reportWebVitals()
