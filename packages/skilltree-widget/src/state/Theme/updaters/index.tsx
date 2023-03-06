import { useEffect } from 'react'

import { AppThemeMode, useAppThemeModeWrite } from '..'

export function ThemeUpdater({ mode }: { mode: AppThemeMode }) {
  const [, setMode] = useAppThemeModeWrite()

  useEffect(() => {
    setMode(mode)
  }, [mode, setMode])

  return null
}
