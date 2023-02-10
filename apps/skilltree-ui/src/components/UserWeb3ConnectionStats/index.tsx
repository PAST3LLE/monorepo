import { RowProps, Column } from '@past3lle/components'
import { BLACK_TRANSPARENT } from '@past3lle/theme'
import { truncateAddress } from '@past3lle/utils'
import { useWeb3Modal } from '@web3modal/react'
import { OpenOptions } from 'components/Button/Web3Button'
import { FlashingText } from 'components/FlashingText'
import { MonospaceText } from 'components/Text'
import React, { useCallback } from 'react'
import styled from 'styled-components/macro'
import { useAccount, useNetwork } from 'wagmi'

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
  const { open } = useWeb3Modal()

  const handleClick = useCallback(
    async (openOptions: OpenOptions) => {
      open(openOptions)
    },
    [open]
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
        onClick={() => handleClick({ route: address ? 'Account' : 'ConnectWallet' })}
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
        onClick={() => handleClick({ route: 'SelectNetwork' })}
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

const ConnectionColorWrapper = styled.div<{ isConnected: boolean }>`
  > ${FlashingText}, > i {
    color: ${({ isConnected }) => (isConnected ? 'springgreen' : 'indianred')};
  }
`
