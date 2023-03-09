import { Row } from '@past3lle/components'
import { useGetWindowSize } from '@past3lle/forge-web3'
import { MEDIA_WIDTHS } from '@past3lle/theme'
import { isMobile } from '@past3lle/utils'
import React from 'react'

import { useSidePanelAtomBase } from '../../state/SidePanel'
import { InventoryButton } from '../Common/Button'
import { ConnectionInfoButton } from '../Common/Button/ConnectionInfoButton'
import { NetworkInfoButton } from '../Common/Button/NetworkInfoButton'
import { ShopExternalLinkButton } from '../Common/Button/ShopExternalLinkButton'
import { HeaderContainer, Web3InfoContainer } from './styleds'

export const SkilltreeHeader = () => {
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
            <ShopExternalLinkButton />
            <InventoryButton />
            <NetworkInfoButton />
            <ConnectionInfoButton />
          </Row>
        </Web3InfoContainer>
      </Row>
    </HeaderContainer>
  )
}
