import { BV, Button, ButtonProps } from '@past3lle/components'
import React from 'react'

import { useAppThemeMode } from '../../../state/Theme'

export function ThemeChangerButton({
  label = 'CHANGE THEME',
  bgImage,
  ...buttonProps
}: ButtonProps & { label?: string }) {
  const [mode, changeMode] = useAppThemeMode()
  return (
    <Button
      minWidth={buttonProps.minWidth || '10rem'}
      variant={buttonProps.variant || BV.THEME}
      onClick={() => changeMode(mode === 'DARK' ? 'LIGHT' : 'DARK')}
      color={buttonProps.color || (mode === 'DARK' ? '#fff' : '#000')}
      bgImage={bgImage && bgImage}
      {...buttonProps}
    >
      {label}
    </Button>
  )
}
