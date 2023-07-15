import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { WindowSizeProvider } from '@past3lle/hooks'
import React from 'react'
import 'react-app-polyfill/ie11'
import ReactDOM from 'react-dom/client'
import reportWebVitals from 'reportWebVitals'
import { App } from 'views'

const container = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(container)

root.render(
  <WindowSizeProvider>
    <App />
  </WindowSizeProvider>
)

// SERVICE WORKER (e.g USER OFFLINE USE)
// README: change to unregister to remove SW
serviceWorkerRegistration.register()

// WEB VITALS REPORTING
// README: change to unregister to remove web vitals reporting
reportWebVitals()
