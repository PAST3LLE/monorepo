import { Web3InfoContainer } from '../common'
import { CheckoutForge, HeaderContainer } from './styleds'
import { Row } from '@past3lle/components'
import { MEDIA_WIDTHS } from '@past3lle/theme'
import { isMobile } from '@past3lle/utils'
import { InventoryButton } from 'components/Button'
import { ConnectionInfoButton } from 'components/Button/ConnectionInfoButton'
import { NetworkInfoButton } from 'components/Button/NetworkInfoButton'
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
        <Web3InfoContainer
          onClick={() => isMobileWidth && openSidePanel((state) => ({ type: ['USER_STATS', ...state.type] }))}
        >
          <Row>
            <CheckoutForge />
            <InventoryButton restWordProps={{ fontSize: '1.8rem' }} />
            <NetworkInfoButton />
            <ConnectionInfoButton />
          </Row>
        </Web3InfoContainer>
      </Row>
    </HeaderContainer>
  )
}
