import { InfoCircle, MouseoverTooltip } from '@past3lle/components'
import { OFF_BLACK, setBestTextColour } from '@past3lle/theme'
import React from 'react'
import { useTheme } from 'styled-components'

interface Props {
  tooltip: string
  size?: number
  placement?: Parameters<typeof MouseoverTooltip>[0]['placement']
}
export function Tooltip({ tooltip, size = 10, placement }: Props) {
  const { modals: theme } = useTheme()
  return (
    <MouseoverTooltip
      text={tooltip}
      placement={placement}
      styles={{
        fontFamily: 'monospace, arial, system-ui',
        fontSize: '0.75em',
        color: setBestTextColour(theme?.base?.container?.main?.background || OFF_BLACK, 4),
        border: 'none',
        backgroundColor: theme?.base?.container?.main?.background || OFF_BLACK,
        margin: 'auto'
      }}
    >
      <InfoCircle
        label="i"
        size={size}
        backgroundColor={theme?.base?.button?.active?.background?.default || OFF_BLACK}
        color={setBestTextColour(theme?.base?.button?.active?.background?.default || OFF_BLACK, 4)}
        margin="auto"
      />
    </MouseoverTooltip>
  )
}
