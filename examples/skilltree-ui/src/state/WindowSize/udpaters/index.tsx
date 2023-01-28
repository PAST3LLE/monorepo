import { useWindowSize } from '@past3lle/hooks'
import { useAtom } from 'jotai'
import * as React from 'react'

import { windowSizeAtom } from '..'

export function WindowSizeUpdater() {
  const windowSizes = useWindowSize()
  const [, setWindowSize] = useAtom(windowSizeAtom)

  React.useEffect(() => {
    setWindowSize(windowSizes)
  }, [setWindowSize, windowSizes])

  return null
}
