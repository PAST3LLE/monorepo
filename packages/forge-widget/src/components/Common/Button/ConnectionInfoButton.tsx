import { Row, Text } from '@past3lle/components'
import { setCssBackground, urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import { truncateAddress } from '@past3lle/utils'
import { useWeb3Modal } from '@web3modal/react'
import { useCallback } from 'react'
import React from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

import { useAssetsMap } from '../../../theme/utils'
import { ConnectionColorWrapper } from '../../Web3/UserWeb3ConnectionStats'
import { OpenOptions } from './OpenWeb3ModalButton'

export function ConnectionInfoButton() {
  const { address } = useAccount()
  const { open } = useWeb3Modal()

  const assetsMap = useAssetsMap()

  const handleClick = useCallback(
    async (openOptions: OpenOptions) => {
      open(openOptions)
    },
    [open]
  )

  return (
    <ConnectionInfoContainer
      title={'Account and connection information. Click to view/change accounts.'}
      width={'26rem'}
      minWidth="24rem"
      marginTop="0.6rem"
      gap="0.5rem"
      onClick={() => handleClick({ route: address ? 'Account' : 'ConnectWallet' })}
    >
      <img src={assetsMap.icons.connection} />
      <Text.SubHeader
        margin={'0 0 1rem 0'}
        padding={0}
        fontWeight={!!address ? 500 : 700}
        fontStyle="normal"
        fontFamily={'monospace'}
        letterSpacing="-1.6px"
      >
        <ConnectionColorWrapper isConnected={!!address}>
          <small>{`${address ? truncateAddress(address, { type: 'long' }) : '<disconnected>'}`}</small>
        </ConnectionColorWrapper>
      </Text.SubHeader>
    </ConnectionInfoContainer>
  )
}

const ConnectionInfoContainer = styled(Row).attrs({ justifyContent: 'center', alignItems: 'center' })`
  min-width: 257px;
  min-height: 8rem;
  cursor: pointer;
  > img {
    max-width: 8%;
    margin-bottom: 0.95rem;
    opacity: 0.8;
  }
  small {
    text-shadow: 3px 2px 1px #ffffffc9;
  }
  filter: invert(1);
  ${({ theme }) =>
    theme.assetsMap.images.background.header?.account &&
    setCssBackground(theme, {
      imageUrls: [urlToSimpleGenericImageSrcSet(theme.assetsMap.images.background.header.account)],
      backgroundAttributes: ['center/contain no-repeat']
    })}
`
