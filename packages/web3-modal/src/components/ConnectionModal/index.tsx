import { Button, ButtonProps, CloseIcon, Modal, ModalProps } from '@past3lle/components'
import { BasicUserTheme, ThemeByModes, ThemeProvider } from '@past3lle/theme'
import { devWarn } from '@past3lle/utils'
import React, { memo, useMemo, useState } from 'react'

import { useConnection, useModalTheme, usePstlWeb3Modal } from '../../hooks'
import { getConnectorInfo } from '../../utils'
import { LoadingScreen, LoadingScreenProps } from '../LoadingScreen'
import { InnerContainer } from './styled'

interface PstlWeb3ConnectionModalProps extends Omit<ModalProps, 'isOpen' | 'onDismiss'> {
  title?: string
  modalTheme?: ThemeByModes<BasicUserTheme>
  loaderProps?: LoadingScreenProps
  buttonProps?: ButtonProps
}

function PreMemoModal({
  title = 'WALLET CONNECTION',
  buttonProps,
  modalTheme,
  loaderProps,
  ...modalProps
}: PstlWeb3ConnectionModalProps) {
  const [connectors, { connect, openW3Modal }, { address, chainId, currentConnector }] = useConnection()
  const { isOpen, close } = usePstlWeb3Modal()

  // flag for setting whether or not web3auth modal has mounted as it takes a few seconds first time around
  // and we want to close the pstlModal only after the web3auth modal has mounted
  const [w3aModalMounted, setW3aModalMounted] = useState(false)
  const [w3aModalLoading, setW3aModalLoading] = useState(false)

  const data = useMemo(
    () =>
      connectors.slice(0, 2).map((connector, index) => {
        const [{ label, logo, connected }, callback] = getConnectorInfo(
          connector,
          currentConnector,
          {
            connect,
            openW3Modal,
            closePstlModal: close,
            setW3aModalMounted,
            setW3aModalLoading
          },
          chainId,
          address,
          w3aModalMounted
        )

        return (
          <Button key={connector.id + '_' + index} onClick={callback} {...buttonProps}>
            <img style={{ maxWidth: 50 }} src={logo} />
            {connected ? `Connected to ${label}` : `Connect with ${label}`}
          </Button>
        )
      }),
    [address, buttonProps, chainId, close, connect, connectors, currentConnector, openW3Modal, w3aModalMounted]
  )

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
          {w3aModalLoading ? <LoadingScreen {...loaderProps} /> : data}
        </InnerContainer>
      </Modal>
    </ThemeProvider>
  )
}
const PstlWeb3ConnectionModal = memo(PreMemoModal)

export { PstlWeb3ConnectionModal, type PstlWeb3ConnectionModalProps }
