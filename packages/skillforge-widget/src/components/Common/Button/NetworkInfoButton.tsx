import { Row } from '@past3lle/components'
import { SupportedChains, useSkillForgeWindowSizeAtom } from '@past3lle/skillforge-web3'
import { MEDIA_WIDTHS } from '@past3lle/theme'
import { useWeb3Modal } from '@web3modal/react'
// import { useWeb3Modal } from '@web3modal/react'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useNetwork } from 'wagmi'

import { SkillForgeAssetsMap as AssetsMap } from '../../../theme/types'
import { useAssetsMap } from '../../../theme/utils'
import { MonospaceText } from '../Text'

export function NetworkInfoButton() {
  const assetsMap = useAssetsMap()

  const { chain } = useNetwork()

  const chainName = chain?.name
  const chainLogo = _getChainLogo(chain?.id, assetsMap)

  const [{ width = 0 }] = useSkillForgeWindowSizeAtom()
  const showShortLogo = width > MEDIA_WIDTHS.upToSmall && width < MEDIA_WIDTHS.upToMedium

  const { open } = useWeb3Modal()

  const handleClick = useCallback(async () => {
    return open({ route: 'SelectNetwork' })
  }, [open])

  if (!chain?.id) return null

  return (
    <NetworkInfoButtonContainer
      justifyContent={'center'}
      alignItems="center"
      onClick={handleClick}
      title={
        !chainName
          ? 'Disconnected. Click to select a network and connect.'
          : `Connected to ${chainName}. Click to view/change networks.`
      }
    >
      <img src={chainLogo} />
      {!showShortLogo && <MonospaceText>{chainName}</MonospaceText>}
    </NetworkInfoButtonContainer>
  )
}

const NetworkInfoButtonContainer = styled(Row).attrs({ justifyContent: 'center', alignItems: 'center' })`
  height: 80%;
  // width: 5rem;
  width: auto;
  cursor: pointer;
  gap: 0.3rem 0.75rem;
  background-color: #000000d4;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  box-shadow: 4px 4px 1px 0px #000000bd;

  > img {
    max-height: 100%;
  }
  > ${MonospaceText} {
    font-size: 1rem;
    color: ${({ theme }) => theme.mainFg};
  }

  &:hover {
    box-shadow: 0px 0px 1px black;
    transform: translate(4px, 4px);
  }

  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
`

function _getChainLogo(id: number | undefined, assetsMap: AssetsMap['assetsMap']) {
  switch (id) {
    // GOERLI
    case SupportedChains.GOERLI:
      return assetsMap.icons.chains[SupportedChains.GOERLI]
    case SupportedChains.POLYGON_MUMBAI:
      return assetsMap.icons.chains[SupportedChains.POLYGON_MUMBAI]
    default:
      return assetsMap.icons.chains.disconnected
  }
}
