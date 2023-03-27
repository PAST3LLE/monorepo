import { Button, ButtonProps, CloseIcon, Modal, ModalProps } from '@past3lle/components'
import { BasicUserTheme, ThemeByModes, ThemeProvider } from '@past3lle/theme'
import { devWarn } from '@past3lle/utils'
import React, { memo } from 'react'

import { useConnection, useModalTheme, useWeb3Modal } from '../../hooks'
import { getConnectorInfo } from '../../utils'
import { InnerContainer } from './styled'

interface PstlWeb3ConnectionModalProps extends Omit<ModalProps, 'isOpen' | 'onDismiss'> {
  buttonProps?: ButtonProps
  title?: string
  modalTheme?: ThemeByModes<BasicUserTheme>
}

function PreMemoModal({
  title = 'WALLET CONNECTION',
  buttonProps,
  modalTheme,
  ...modalProps
}: PstlWeb3ConnectionModalProps) {
  const [connectors, { connect, openW3Modal }, { address, chainId, currentConnector }] = useConnection()
  const { isOpen, close } = useWeb3Modal()

  const theme = useModalTheme(modalTheme)
  if (!theme) {
    devWarn('[@past3lle/web3-modal::ConnectionModal] No theme detected!')
    return null
  }

  return (
    <ThemeProvider theme={theme}>
      <Modal className={modalProps.className} isOpen={isOpen} onDismiss={close}>
        <InnerContainer justifyContent="flex-start" gap="0.75rem">
          <CloseIcon style={{ position: 'absolute', right: '0.5rem', top: '0.5rem' }} onClick={close} />
          <h1>{title}</h1>
          {connectors.slice(0, 2).map((connector, index) => {
            const [{ label, logo, connected }, callback] = getConnectorInfo(
              connector,
              currentConnector,
              {
                connect,
                openW3Modal
              },
              chainId,
              address
            )

            return (
              <Button key={connector.id + '_' + index} onClick={() => callback().then(close)} {...buttonProps}>
                <img style={{ maxWidth: 50 }} src={logo} />
                {connected ? `Connected to ${label}` : `Connect with ${label}`}
              </Button>
            )
          })}
        </InnerContainer>
      </Modal>
    </ThemeProvider>
  )
}
const PstlWeb3ConnectionModal = memo(PreMemoModal)

export { PstlWeb3ConnectionModal, type PstlWeb3ConnectionModalProps }
