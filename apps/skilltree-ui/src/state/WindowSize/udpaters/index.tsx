import { windowSizeAtom } from '..'
import { useWindowSize } from '@past3lle/hooks'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

export function WindowSizeUpdater() {
  const windowSizes = useWindowSize()
  const [, setWindowSize] = useAtom(windowSizeAtom)

  useEffect(() => {
    setWindowSize(windowSizes)
  }, [setWindowSize, windowSizes])

  return null
}
