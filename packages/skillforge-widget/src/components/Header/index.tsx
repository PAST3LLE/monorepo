import { Row } from '@past3lle/components'
import { useDeriveAppType, useForgeGetUserConfigChainsAtom, useForgeWindowSizeAtom } from '@past3lle/forge-web3'
import { MEDIA_WIDTHS } from '@past3lle/theme'
import React, { useEffect, useState } from 'react'

import { AppMessagesBanner } from '../AppMessagesBanner'
import { InventoryButton } from '../Common/Button'
import { ConnectionInfoButton } from '../Common/Button/ConnectionInfoButton'
import { NetworkInfoButton } from '../Common/Button/NetworkInfoButton'
import { ShopExternalLinkButton } from '../Common/Button/ShopExternalLinkButton'
import { SkillFlowsButton } from '../Common/Button/SkillFlowsButton'
import { HeaderContainer, Web3InfoContainer } from './styleds'

export const SkillForgeHeader = () => {
  const [{ width = 0 }] = useForgeWindowSizeAtom()
  const isMobileWidth = width <= MEDIA_WIDTHS.upToSmall
  const showNetworkButton = useShowNetworkButton(isMobileWidth)
  return (
    <>
      <HeaderContainer>
        <Row gap="1rem" height="100%" width="100%" justifyContent={'space-between'}>
          <Web3InfoContainer>
            <Row flexDirection={isMobileWidth ? 'row-reverse' : 'row'}>
              {!isMobileWidth && <ShopExternalLinkButton />}
              <InventoryButton />
              <SkillFlowsButton />
              {showNetworkButton && <NetworkInfoButton />}
              {!isMobileWidth && <ConnectionInfoButton />}
            </Row>
          </Web3InfoContainer>
        </Row>
      </HeaderContainer>
      <AppMessagesBanner />
    </>
  )
}

function useShowNetworkButton(isMobileWidth: boolean) {
  const [{ length: chainsLength }] = useForgeGetUserConfigChainsAtom()
  const appType = useDeriveAppType()

  const [isDappBrowser, setIsDappBrowser] = useState(false)
  useEffect(() => {
    const isSafe = appType === 'SAFE_APP'
    const isFrame = appType === 'IFRAME'

    setIsDappBrowser(isSafe || isFrame)
  }, [appType])

  const isWebMultipleNetworks = !isMobileWidth && chainsLength > 1
  return !isDappBrowser && (isWebMultipleNetworks || isMobileWidth)
}
