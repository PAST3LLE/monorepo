import { Row } from '@past3lle/components'
import { MakeOptional } from '@past3lle/types'
import React from 'react'
import styled from 'styled-components'

import { ContainerThemeTypes, ModalText } from './styled'

const AttributionText = styled(ModalText).attrs((props: any) => ({
  color: props.theme.modals?.base?.attribution?.color
}))`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  > img {
    width: 40px;
  }
`

const PoweredByLabelContainer = styled(Row).attrs({
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 'auto',
  padding: '3px'
})<ContainerThemeTypes>`
  z-index: 500;

  a {
    color: inherit;
    outline: none;
    text-decoration: none;

    > strong {
      font-weight: 400;
      font-variation-settings: 'wght' 400;
    }
  }
`

export function PoweredByLabel({ modal = 'base', node = 'main' }: MakeOptional<ContainerThemeTypes, 'modal' | 'node'>) {
  return (
    <PoweredByLabelContainer modal={modal} node={node} title="POWERED BY PAST3LLE LABS">
      <AttributionText modal="base" node="subHeader" fontSize={10}>
        <a href="https://pastellelabs.com?=referrer=pstl-web3-modal" target="_blank" referrerPolicy="no-referrer">
          POWERED BY{' '}
          <AttributionText modal="base" node="strong" display="inline-block">
            PAST3LLE LABS
          </AttributionText>
        </a>
      </AttributionText>
    </PoweredByLabelContainer>
  )
}
