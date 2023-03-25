import { Button, ButtonProps, CloseIcon, Modal, ModalProps } from '@past3lle/components'
import { BasicUserTheme, ThemeByModes, ThemeProvider } from '@past3lle/theme'
import { devWarn } from '@past3lle/utils'
import React from 'react'

import { useConnection, useModalTheme } from '../../hooks'
import { getConnectorInfo } from '../../utils'
import { InnerContainer } from './styled'

export interface ConnectionModalProps extends ModalProps {
  buttonProps?: ButtonProps
  title?: string
  modalTheme?: ThemeByModes<BasicUserTheme>
}

export function ConnectionModal({
  title = 'WALLET CONNECTION',
  buttonProps,
  modalTheme,
  ...modalProps
}: ConnectionModalProps) {
  const [connectors, { connect, openW3Modal }] = useConnection()

  const theme = useModalTheme(modalTheme)

  if (!theme) {
    devWarn('[@past3lle/web3-modal::ConnectionModal] No theme detected!')
    return null
  }

  return (
    <ThemeProvider theme={theme}>
      <Modal className={modalProps.className} isOpen={modalProps.isOpen} onDismiss={console.debug}>
        <InnerContainer justifyContent="flex-start" gap="0.75rem">
          <CloseIcon style={{ position: 'absolute', right: '0.5rem', top: '0.5rem' }} onClick={modalProps.onDismiss} />
          <h1>{title}</h1>
          {connectors.slice(0, 2).map((connector, index) => {
            const [{ label, logo }, callback] = getConnectorInfo(connector, { connect, openW3Modal })
            return (
              <Button key={connector.id + '_' + index} onClick={callback} {...buttonProps}>
                <img style={{ maxWidth: 50 }} src={logo} />
                Connect with {label}
              </Button>
            )
          })}
        </InnerContainer>
      </Modal>
    </ThemeProvider>
  )
}
