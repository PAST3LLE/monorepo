import { Row } from '@past3lle/components'
import { AppType, getAppType, useForgeGetUserConfigChainsAtom } from '@past3lle/forge-web3'
import React, { useEffect, useState } from 'react'

import { AppMessagesBanner } from '../AppMessagesBanner'
import { InventoryButton } from '../Common/Button'
import { HeaderContainer, Web3InfoContainer, StyledConnectionInfoButton, StyledNetworkInfoButton, StyledShopExternalLinkButton } from './styleds'

export const SkillForgeHeader = () => {
  const renderNetworkInfoButton = useRenderNetworkButton()
  return (
    <>
      <HeaderContainer>
        <Row gap="1rem" height="100%" width="100%" justifyContent={'space-between'}>
          <Web3InfoContainer>
            <Row>
              <StyledShopExternalLinkButton />
              <InventoryButton />
              {renderNetworkInfoButton && <StyledNetworkInfoButton />}
              <StyledConnectionInfoButton />
            </Row>
          </Web3InfoContainer>
        </Row>
      </HeaderContainer>
      <AppMessagesBanner />
    </>
  )
}

function useRenderNetworkButton() {
  const [{ length: chainsLength }] = useForgeGetUserConfigChainsAtom()

  const [isDappBrowser, setIsDappBrowser] = useState(false)
  useEffect(() => {
    const appType = getAppType()
    const isSafe = appType === AppType.SAFE_APP
    const isFrame = appType === AppType.IFRAME

    setIsDappBrowser(isSafe || isFrame)
  }, [])

  const hasMultipleNetworks = chainsLength > 1
  return !isDappBrowser && hasMultipleNetworks
}
