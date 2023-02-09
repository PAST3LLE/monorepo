import { ThemedButton } from '.'
import { Row } from '@past3lle/components'
import { useWeb3Modal } from '@web3modal/react'
import React, { useCallback } from 'react'
import { ButtonProps } from 'rebass'

export interface OpenOptions {
  uri?: string
  standaloneChains?: string[]
  route?: 'Account' | 'ConnectWallet' | 'Help' | 'SelectNetwork'
}

interface Props {
  children?: React.ReactNode
  logoUri?: string | null
  openOptions?: OpenOptions
  buttonProps?: ButtonProps
}

export function SkillsWeb3Button({ logoUri, openOptions, buttonProps, children }: Props) {
  const { open, isOpen } = useWeb3Modal()

  const handleClick = useCallback(async () => {
    open(openOptions)
  }, [open, openOptions])

  return (
    <ThemedButton disabled={isOpen} onClick={handleClick} {...buttonProps}>
      <Row justifyContent={'center'} alignItems="center">
        {logoUri && <img src={logoUri} />}
        {children}
      </Row>
    </ThemedButton>
  )
}
