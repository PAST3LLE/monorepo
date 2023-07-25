import { useWindowSize } from '@past3lle/hooks'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

import { windowSizeAtom } from '..'

export function ForgeWindowSizeUpdater() {
  const windowSizes = useWindowSize()
  const [, setWindowSize] = useAtom(windowSizeAtom)

  useEffect(() => {
    windowSizes && setWindowSize(windowSizes)
  }, [setWindowSize, windowSizes])

  return null
}
