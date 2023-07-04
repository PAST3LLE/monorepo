import { CheckCircle, RowStart } from '@past3lle/components'
import React from 'react'
import styled from 'styled-components'

export const StyledConnectedCheckMark = styled(RowStart)`
  position: absolute;
  top: 1em;
  left: 1em;

  gap: 0.4em;

  font-size: 0.5em;
`

export function ConnectedCheckMark() {
  return (
    <StyledConnectedCheckMark>
      Connected <CheckCircle size={8} />
    </StyledConnectedCheckMark>
  )
}
