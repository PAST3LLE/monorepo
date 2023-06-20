import { Row } from '@past3lle/components'
import { useForgeWindowSizeAtom } from '@past3lle/forge-web3'
import { MEDIA_WIDTHS } from '@past3lle/theme'
import React from 'react'

import { AppMessagesBanner } from '../AppMessagesBanner'
import { InventoryButton } from '../Common/Button'
import { ConnectionInfoButton } from '../Common/Button/ConnectionInfoButton'
import { NetworkInfoButton } from '../Common/Button/NetworkInfoButton'
import { ShopExternalLinkButton } from '../Common/Button/ShopExternalLinkButton'
import { HeaderContainer, Web3InfoContainer } from './styleds'

export const SkillForgeHeader = () => {
  const [{ width = 0 }] = useForgeWindowSizeAtom()
  const isMobileWidth = width <= MEDIA_WIDTHS.upToSmall
  return (
    <>
      <HeaderContainer>
        <Row gap="1rem" height="100%" width="100%" justifyContent={'space-between'}>
          <Web3InfoContainer>
            <Row flexDirection={isMobileWidth ? 'row-reverse' : 'row'}>
              {!isMobileWidth && <ShopExternalLinkButton />}
              <InventoryButton />
              <NetworkInfoButton />
              {!isMobileWidth && <ConnectionInfoButton />}
            </Row>
          </Web3InfoContainer>
        </Row>
      </HeaderContainer>
      <AppMessagesBanner />
    </>
  )
}
