import { CheckCircle, RowStart } from '@past3lle/components'
import React from 'react'
import styled from 'styled-components'

export const StyledConnectedCheckMark = styled(RowStart)`
  position: absolute;
  top: 0.5em;
  right: 0.5em;

  gap: 0.4em;

  font-size: 0.6em;
`

export function ConnectedCheckMark() {
  return (
    <StyledConnectedCheckMark>
      Connected <CheckCircle size={10} />
    </StyledConnectedCheckMark>
  )
}
