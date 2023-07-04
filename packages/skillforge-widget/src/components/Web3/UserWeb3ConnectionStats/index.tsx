import { Column, RowProps } from '@past3lle/components'
import { useW3Modals } from '@past3lle/forge-web3'
import { BLACK_TRANSPARENT } from '@past3lle/theme'
import { truncateAddress } from '@past3lle/utils'
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

  const {
    root: { open: openRoot },
    walletConnect: { open: openWC }
  } = useW3Modals()

  const handleClick = useCallback(
    async (connectedRoute: OpenOptions['route'], disconnectedRoute: OpenOptions['route']) => {
      address ? openWC({ route: connectedRoute }) : openRoot({ route: disconnectedRoute })
    },
    [address, openRoot, openWC]
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

export const UserConnectionStats = styled(UnstyledUserConnectionStats)`
  filter: invert(1);
`

export const ConnectionColorWrapper = styled.div<{ isConnected: boolean }>`
  > ${FlashingText}, > i,
  > * {
    color: ${({ isConnected }) => (isConnected ? '#49a749' : '#ff8282')};
  }
`
