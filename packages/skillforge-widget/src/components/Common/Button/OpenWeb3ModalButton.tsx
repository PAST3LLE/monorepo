import { ButtonProps, Row } from '@past3lle/components'
import { useW3Modal } from '@past3lle/forge-web3'
import React, { useCallback } from 'react'

import { ThemedButton } from './common'
import { OpenOptions } from './types'

interface Props {
  children?: React.ReactNode
  logoUri?: string | null
  buttonProps?: ButtonProps
  openOptions: OpenOptions
}

export function OpenWeb3ModalButton({ logoUri, buttonProps, openOptions, children }: Props) {
  const { open, isOpen } = useW3Modal()

  const handleClick = useCallback(async () => {
    open(openOptions)
  }, [openOptions, open])

  return (
    <ThemedButton disabled={isOpen} onClick={handleClick} {...buttonProps}>
      <Row justifyContent={'center'} alignItems="center">
        {logoUri && <img src={logoUri} />}
        {children}
      </Row>
    </ThemedButton>
  )
}
