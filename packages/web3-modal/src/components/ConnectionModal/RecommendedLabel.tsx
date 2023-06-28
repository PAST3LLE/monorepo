import { CheckCircle, RowStart } from '@past3lle/components'
import React from 'react'
import styled from 'styled-components'

export const RecommendedLabelWrapper = styled(RowStart)`
  position: absolute;
  bottom: 0.75em;
  right: 0.75em;

  gap: 0.4em;

  font-size: 0.5em;
`

export function RecommendedLabel() {
  return (
    <RecommendedLabelWrapper>
      Recommended <CheckCircle size={10} />
    </RecommendedLabelWrapper>
  )
}
