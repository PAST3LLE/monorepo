import { Column, RowProps } from '@past3lle/components'
import { BLACK_TRANSPARENT } from '@past3lle/theme'
import { truncateAddress } from '@past3lle/utils'
import { usePstlConnection, usePstlWeb3Modal } from '@past3lle/web3-modal'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useAccount, useNetwork } from 'wagmi'

import { OpenOptions } from '../../Common/Button/types'
import { FlashingText } from '../../Common/FlashingText'
import { MonospaceText } from '../../Common/Text'

function UnstyledUserConnectionStats({
  containerProps,
  fontSize = '1.5rem',
  className
}: {
  containerProps?: RowProps
  fontSize?: string
  className?: string
}) {
  const { address } = useAccount()
  const { chain } = useNetwork()

  const { open } = usePstlWeb3Modal()
  const [, { openW3Modal }] = usePstlConnection()

  const handleClick = useCallback(
    async (connectedRoute: OpenOptions['route'], disConnectedRoute: OpenOptions['route']) => {
      address ? openW3Modal({ route: connectedRoute }) : open({ route: disConnectedRoute })
    },
    [address, open, openW3Modal]
  )

  return (
    <Column
      backgroundColor={BLACK_TRANSPARENT}
      padding="0.8rem 1rem"
      justifyContent="center"
      alignItems="flex-start"
      borderRadius="5px"
      className={className}
      {...containerProps}
    >
      <MonospaceText
        cursor="pointer"
        fontSize={fontSize}
        title={address || 'disconnected'}
        color={'#f8f8ffed'}
        onClick={() => handleClick('Account', 'ConnectWallet')}
      >
        <ConnectionColorWrapper isConnected={!!address}>
          <FlashingText>{`> `}</FlashingText>
          <strong>CONNECTION</strong>{' '}
          <i>
            <small>{`${address ? truncateAddress(address) : '<disconnected>'}`}</small>
          </i>
        </ConnectionColorWrapper>
      </MonospaceText>
      <MonospaceText
        cursor="pointer"
        fontSize={fontSize}
        color={'#f8f8ffed'}
        onClick={() => handleClick('SelectNetwork', 'SelectNetwork')}
      >
        <ConnectionColorWrapper isConnected={!!address}>
          <FlashingText>{`> `}</FlashingText>
          <strong>NETWORK</strong>{' '}
          <i>
            <small>{`${chain?.name || '<disconnected>'}`}</small>
          </i>
        </ConnectionColorWrapper>
      </MonospaceText>
    </Column>
  )
}

export const UserConnectionStats = styled(UnstyledUserConnectionStats)``

export const ConnectionColorWrapper = styled.div<{ isConnected: boolean }>`
  > ${FlashingText}, > i,
  > * {
    color: ${({ isConnected }) => (isConnected ? 'green' : '#52d5b8')};
  }
`
