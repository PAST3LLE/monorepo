import { Web3InfoContainer } from '../common'
import { Skilltreecon, CheckoutForge, HeaderContainer, LogoHeader } from './styleds'
import { Row } from '@past3lle/components'
import { InventoryButton } from 'components/Button'
import { ConnectionInfoButton } from 'components/Button/ConnectionInfoButton'
import { NetworkInfoButton } from 'components/Button/NetworkInfoButton'
import { CursiveHeader } from 'components/Text'
import React from 'react'

export const Header = () => {
  return (
    <HeaderContainer>
      <Row gap="1rem" height="100%" width="100%" justifyContent={'space-between'}>
        <LogoHeader>
          <Skilltreecon />
          <Row alignItems={'center'} width="100%" gap="0 1rem">
            <CursiveHeader fontSize="5rem">FORGE</CursiveHeader>
            <CheckoutForge />
          </Row>
        </LogoHeader>
        <Web3InfoContainer>
          <Row margin="0.5rem" width="auto" height="52px" gap="0 2rem">
            <InventoryButton restWordProps={{ fontSize: '1.8rem' }} />
            <NetworkInfoButton />
            <ConnectionInfoButton />
          </Row>
        </Web3InfoContainer>
      </Row>
    </HeaderContainer>
  )
}
