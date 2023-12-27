import { InfoCircle, InfoCircleProps, MouseoverTooltip } from '@past3lle/components'
import { BLACK_TRANSPARENT, OFF_WHITE } from '@past3lle/theme'
import React from 'react'
import { useTheme } from 'styled-components'

type Props = Omit<Parameters<typeof MouseoverTooltip>[0] & InfoCircleProps, 'children'>

export function MouseoverCircle({ size, label, color, backgroundColor, margin, ...mouseoverProps }: Props) {
  const { modals: theme } = useTheme()
  return (
    <MouseoverTooltip
      {...mouseoverProps}
      styles={{
        fontFamily: theme?.base?.tooltip?.font?.family + ', arial, system-ui',
        fontSize: '12px',
        color: theme?.base?.tooltip?.font?.color || OFF_WHITE,
        border: 'none',
        backgroundColor: theme?.base?.tooltip?.background || BLACK_TRANSPARENT
      }}
    >
      <InfoCircle label={label} size={size} color={color} backgroundColor={backgroundColor} margin={margin} />
    </MouseoverTooltip>
  )
}
