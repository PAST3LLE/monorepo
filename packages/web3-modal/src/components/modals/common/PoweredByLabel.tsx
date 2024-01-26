import { Row } from '@past3lle/components'
import { setBestTextColour } from '@past3lle/theme'
import { MakeOptional } from '@past3lle/types'
import React from 'react'
import styled from 'styled-components'

import { ContainerThemeTypes, ModalText } from './styled'

const PoweredByLabelContainer = styled(Row).attrs({
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 'auto',
  padding: '3px'
})<ContainerThemeTypes>`
  z-index: 500;
  > ${ModalText} {
    color: ${({ theme: { modals }, modal }) =>
      modals?.[modal]?.background?.main
        ? setBestTextColour(modals?.base?.background?.main as string, 7)
        : modals?.[modal]?.font?.color};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    > img {
      width: 40px;
    }
  }

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
      <ModalText modal="base" node="subHeader" fontSize={10}>
        <a href="https://pastellelabs.com?=referrer=pstl-web3-modal" target="_blank" referrerPolicy="no-referrer">
          POWERED BY{' '}
          <ModalText modal="base" node="strong" display="inline-block">
            PAST3LLE LABS
          </ModalText>
        </a>
      </ModalText>
    </PoweredByLabelContainer>
  )
}
