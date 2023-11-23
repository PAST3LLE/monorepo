import { UseWindowSizeOptions, useWindowSize } from '@past3lle/hooks'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

import { windowSizeAtom } from '..'

export function ForgeWindowSizeUpdater(options: UseWindowSizeOptions) {
  const windowSizes = useWindowSize(options)
  const [, setWindowSize] = useAtom(windowSizeAtom)

  useEffect(() => {
    windowSizes && setWindowSize(windowSizes)
  }, [setWindowSize, windowSizes])

  return null
}
