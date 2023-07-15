import React from 'react'

import { WindowSizeProvider, useWindowSize } from '../useWindowSize'

function DefaultApp() {
  const windowSizes = useWindowSize()
  return (
    <div>
      <h1>CONTENT</h1>
      <p>WINDOW SIZES</p>
      <p>WIDTH: {windowSizes?.width}</p>
      <p>HEIGHT: {windowSizes?.height}</p>
      <p>AR: {windowSizes?.ar}</p>
    </div>
  )
}

export default {
  default: (
    <WindowSizeProvider>
      <DefaultApp />
    </WindowSizeProvider>
  )
}
