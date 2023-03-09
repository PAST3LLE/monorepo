import { ButtonProps, Row } from '@past3lle/components'
import { ForgeW3ModalButtonProps } from '@past3lle/forge-web3'
import { useWeb3Modal } from '@web3modal/react'
import React, { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { ThemedButton } from '.'

interface Props {
  children?: React.ReactNode
  logoUri?: string | null
  buttonProps?: ButtonProps
  w3ModalProps: ForgeW3ModalButtonProps
}

export function OpenWeb3ModalButton({ logoUri, buttonProps, w3ModalProps, children }: Props) {
  const { address } = useAccount()

  const { open } = useWeb3Modal()

  const handleClick = useCallback(async () => {
    open({ route: address ? 'Account' : 'ConnectWallet' })
  }, [address, open])

  return (
    <ThemedButton disabled={w3ModalProps.isW3ModalOpen} onClick={handleClick} {...buttonProps}>
      <Row justifyContent={'center'} alignItems="center">
        {logoUri && <img src={logoUri} />}
        {children}
      </Row>
    </ThemedButton>
  )
}
