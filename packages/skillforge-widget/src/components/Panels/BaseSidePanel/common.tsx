import { ArrowLeft, Row } from '@past3lle/components'
import React from 'react'
import styled from 'styled-components'

import { MAIN_COLOR } from './styleds'

const Wrapper = styled.div`
  position: absolute;
  left: 15px;
  top: 6.25rem;
  z-index: 99;
`
interface Props {
  show: boolean
  callback: () => void
}

export const DynamicBackArrow = ({ show, callback }: Props) => (
  <Wrapper>
    <Row justifyContent="space-evenly" alignItems="center" gap="1rem">
      {show && <ArrowLeft size={20} onClick={callback} cursor="pointer" color={MAIN_COLOR} />}
    </Row>
  </Wrapper>
)
