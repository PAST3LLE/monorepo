import { OpenOptions } from './Web3Button'
import { Row, Text } from '@past3lle/components'
import { setCssBackground } from '@past3lle/theme'
import { truncateAddress } from '@past3lle/utils'
import { useWeb3Modal } from '@web3modal/react'
import ICON_INTERNET from 'assets/png/icons/icons8-internet-100.png'
import { ConnectionColorWrapper } from 'components/UserWeb3ConnectionStats'
import { useCallback } from 'react'
import React from 'react'
import styled from 'styled-components/macro'
import { SPRAY_ACCOUNT_DDPX_URL_MAP } from 'theme/global'
import { useAccount } from 'wagmi'

export function ConnectionInfoButton() {
  const { address } = useAccount()
  const { open } = useWeb3Modal()

  const handleClick = useCallback(
    async (openOptions: OpenOptions) => {
      open(openOptions)
    },
    [open]
  )

  return (
    <ConnectionInfoContainer
      width={'26rem'}
      gap="0.5rem"
      onClick={() => handleClick({ route: address ? 'Account' : 'ConnectWallet' })}
    >
      <img src={ICON_INTERNET} />
      <Text.SubHeader margin={'0 0 1rem 0'} padding={0} fontWeight={300} fontStyle="normal">
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
  filter: invert(1);
  ${({ theme }) => setCssBackground(theme, { imageUrls: [SPRAY_ACCOUNT_DDPX_URL_MAP] })}
`
