import React, { useState } from 'react'

import { useOfflineOnlineDetection } from '../useOfflineOnlineDetection'
import {
  useIsExtraSmallMediaWidth,
  useIsLargeMediaWidth,
  useIsMediumMediaWidth,
  useIsSmallMediaWidth,
  useWindowSize
} from '../useWindowSize'

function DefaultApp() {
  const windowSizes = useWindowSize()
  const [showInnerApp, setShowInnerApp] = useState(true)

  useOfflineOnlineDetection({
    handleOnline: () => console.debug('Back online!'),
    handleOffline: () => console.debug('Gone offline!')
  })

  const isExtraSmall = useIsExtraSmallMediaWidth()
  const isSmall = useIsSmallMediaWidth()
  const isMedium = useIsMediumMediaWidth()
  const isLarge = useIsLargeMediaWidth()

  return (
    <div>
      <h1>CONTENT</h1>
      <p>WINDOW SIZES</p>
      <p>WIDTH: {windowSizes?.width}</p>
      <p>HEIGHT: {windowSizes?.height}</p>
      <p>AR: {windowSizes?.ar}</p>

      <p>
        Window size:{' '}
        {isExtraSmall ? 'X-SMALL' : isSmall ? 'SMALL' : isMedium ? 'MEDIUM' : isLarge ? 'LARGE' : 'X-LARGE'}
      </p>
      <button onClick={() => setShowInnerApp((state) => !state)}>Toggle inner app</button>
      {showInnerApp && <InnerApp />}
    </div>
  )
}

function InnerApp() {
  const windowSizes = useWindowSize()
  return (
    <div style={{ marginLeft: '5rem' }}>
      <h1>INNER APP CONTENT</h1>
      <p>WINDOW SIZES</p>
      <p>WIDTH: {windowSizes?.width}</p>
      <p>HEIGHT: {windowSizes?.height}</p>
      <p>AR: {windowSizes?.ar}</p>
    </div>
  )
}

export default {
  default: <DefaultApp />
}
