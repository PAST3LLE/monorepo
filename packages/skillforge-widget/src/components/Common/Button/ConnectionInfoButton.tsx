import { Row, Text } from '@past3lle/components'
import { setBackgroundOrDefault } from '@past3lle/theme'
import { truncateAddress } from '@past3lle/utils'
import { usePstlConnection, usePstlWeb3Modal } from '@past3lle/web3-modal'
import { useCallback } from 'react'
import React from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

import { useAssetsMap } from '../../../theme/utils'
import { ConnectionColorWrapper } from '../../Web3/UserWeb3ConnectionStats'

export function ConnectionInfoButton() {
  const { address } = useAccount()
  const { open } = usePstlWeb3Modal()
  const [, { openW3Modal }] = usePstlConnection()

  const assetsMap = useAssetsMap()

  const handleClick = useCallback(async () => {
    address ? openW3Modal({ route: 'Account' }) : open({ route: 'ConnectWallet' })
  }, [address, open, openW3Modal])

  return (
    <ConnectionInfoContainer
      title={'Account and connection information. Click to view/change accounts.'}
      width={'26rem'}
      minWidth="24rem"
      marginTop="0.6rem"
      gap="0.5rem"
      onClick={handleClick}
    >
      <img src={assetsMap.icons.connection} />
      <Text.SubHeader
        margin="0 0 1rem 0"
        padding={0}
        fontWeight={!!address ? 500 : 700}
        fontStyle="normal"
        fontFamily="monospace"
        letterSpacing="-1.6px"
      >
        <ConnectionColorWrapper isConnected={!!address}>
          <small>{`${address ? truncateAddress(address, { type: 'long' }) : 'LOGIN TO VIEW SKILLS'}`}</small>
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
    setBackgroundOrDefault(
      theme,
      { bgValue: theme.assetsMap.images.background.header.account, defaultValue: 'transparent' },
      { backgroundAttributes: ['center/contain no-repeat'], backgroundColor: 'transparent' }
    )}
`
