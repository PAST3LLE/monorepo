import { Pastellecon, Row, AutoRow, ExternalLink, Header as HeaderPstl } from '@past3lle/components'
import { Web3Button, Web3NetworkSwitch } from '@web3modal/react'
import { BlackHeader, BlackBoldItalic } from 'components/Text'
import { SHOP_URL } from 'constants/index'
import React from 'react'
import styled from 'styled-components/macro'

export const Skilltreecon = styled(Pastellecon)`
  filter: invert(1);
  margin-bottom: -25px;
  z-index: -1;
  transform: rotate(-11deg);
  position: absolute;
  top: -16px;
  left: -20px;
  width: 70%;
`

const LogoHeader = styled(BlackHeader)`
  position: relative;
  z-index: 1;
  color: ghostwhite;
  text-shadow: 4px 2px 3px #00000091;
`
export const Header = () => (
  <HeaderPstl>
    <Row gap="1rem" height="100%" justifyContent={'space-between'}>
      <LogoHeader>
        <Skilltreecon /> SKILLTREE
      </LogoHeader>
      <AutoRow display={'inline-flex'} backgroundColor={'ghostwhite'} padding={'1rem'} marginRight="auto">
        <BlackBoldItalic fontSize={'1.5rem'}>
          CHECK OUT THE{' '}
          <ExternalLink color="red" href={SHOP_URL}>
            THE FORGE
          </ExternalLink>{' '}
        </BlackBoldItalic>
      </AutoRow>
      <Row justifyContent={'flex-end'} width="auto" gap="1rem" minWidth="371px">
        <Web3Button />
        <Web3NetworkSwitch />
      </Row>
    </Row>
  </HeaderPstl>
)
