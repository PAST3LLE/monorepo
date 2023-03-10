import { useDebounce, useWindowSize } from '@past3lle/hooks'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

import { windowSizeAtom } from '..'

export function SkillForgeWindowSizeUpdater() {
  const windowSizes = useWindowSize()
  const debouncedWindowSizes = useDebounce(windowSizes, 300)
  const [, setWindowSize] = useAtom(windowSizeAtom)

  useEffect(() => {
    setWindowSize(debouncedWindowSizes)
  }, [setWindowSize, debouncedWindowSizes])

  return null
}
