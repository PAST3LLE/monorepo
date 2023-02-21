import { Web3InfoContainer } from '../common'
import { Skilltreecon, CheckoutForge, HeaderContainer, LogoHeader } from './styleds'
import { Row } from '@past3lle/components'
import { MEDIA_WIDTHS } from '@past3lle/theme'
import { isMobile } from '@past3lle/utils'
import { InventoryButton } from 'components/Button'
import { ConnectionInfoButton } from 'components/Button/ConnectionInfoButton'
import { NetworkInfoButton } from 'components/Button/NetworkInfoButton'
import { CursiveHeader } from 'components/Text'
import React from 'react'
import { useSidePanelAtomBase } from 'state/SidePanel'
import { useGetWindowSize } from 'state/WindowSize'

export const Header = () => {
  const [, openSidePanel] = useSidePanelAtomBase()
  const [{ width = 0 }] = useGetWindowSize()
  const isMobileWidth = isMobile || width <= MEDIA_WIDTHS.upToSmall
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
        <Web3InfoContainer
          onClick={() => isMobileWidth && openSidePanel((state) => ({ type: ['USER_STATS', ...state.type] }))}
        >
          <Row>
            <InventoryButton restWordProps={{ fontSize: '1.8rem' }} />
            <NetworkInfoButton />
            <ConnectionInfoButton />
          </Row>
        </Web3InfoContainer>
      </Row>
    </HeaderContainer>
  )
}
