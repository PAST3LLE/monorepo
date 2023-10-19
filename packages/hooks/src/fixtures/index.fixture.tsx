import React, { useState } from 'react'

import { useOfflineOnlineDetection } from '../useOfflineOnlineDetection'
import { WindowSizeProvider, useWindowSize } from '../useWindowSize'

function DefaultApp() {
  const windowSizes = useWindowSize()
  const [showInnerApp, setShowInnerApp] = useState(true)
  
  useOfflineOnlineDetection({
    handleOnline: () => alert('Back online!'),
    handleOffline: () => alert('Gone offline!')
  })
  
  return (
    <div>
      <h1>CONTENT</h1>
      <p>WINDOW SIZES</p>
      <p>WIDTH: {windowSizes?.width}</p>
      <p>HEIGHT: {windowSizes?.height}</p>
      <p>AR: {windowSizes?.ar}</p>
      <button onClick={() => setShowInnerApp((state) => !state)}>Toggle inner app</button>
      {showInnerApp && <InnerApp />}
    </div>
  )
}

function InnerApp() {
  const windowSizes = useWindowSize()
  return (
    <WindowSizeProvider>
      <div style={{ marginLeft: '5rem' }}>
        <h1>INNER APP CONTENT</h1>
        <p>WINDOW SIZES</p>
        <p>WIDTH: {windowSizes?.width}</p>
        <p>HEIGHT: {windowSizes?.height}</p>
        <p>AR: {windowSizes?.ar}</p>
      </div>
    </WindowSizeProvider>
  )
}

export default {
  default: (
    <WindowSizeProvider>
      <WindowSizeProvider>
        <WindowSizeProvider>
          <DefaultApp />
        </WindowSizeProvider>
      </WindowSizeProvider>
    </WindowSizeProvider>
  )
}
