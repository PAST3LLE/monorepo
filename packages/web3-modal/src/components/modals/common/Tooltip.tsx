import { InfoCircle, MouseoverTooltip } from '@past3lle/components'
import { OFF_BLACK, setBestTextColour } from '@past3lle/theme'
import React from 'react'
import { useTheme } from 'styled-components'

interface Props {
  tooltip: string
  size?: number
}
export function Tooltip({ tooltip, size = 10 }: Props) {
  const { modals: theme } = useTheme()
  return (
    <MouseoverTooltip
      text={tooltip}
      styles={{
        fontFamily: 'monospace, arial, system-ui',
        fontSize: '0.75em',
        color: setBestTextColour(theme?.base?.container?.main?.background || OFF_BLACK, 4),
        border: 'none',
        backgroundColor: theme?.base?.container?.main?.background || OFF_BLACK
      }}
    >
      <InfoCircle
        label="i"
        size={size}
        backgroundColor={theme?.base?.container?.main?.background || OFF_BLACK}
        color={setBestTextColour(theme?.base?.title?.font?.color || OFF_BLACK, 4)}
        marginLeft="3px"
      />
    </MouseoverTooltip>
  )
}
