import { Button, ButtonProps, CloseIcon, Modal, ModalProps } from '@past3lle/components'
import { BasicUserTheme, ThemeByModes, ThemeProvider } from '@past3lle/theme'
import { devWarn } from '@past3lle/utils'
import React, { Fragment, memo, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'

import { useConnection, useModalTheme, usePstlWeb3Modal } from '../../hooks'
import { getConnectorInfo } from '../../utils'
import { LoadingScreen, LoadingScreenProps } from '../LoadingScreen'
import { ConnectorHelper } from './ConnectorHelper'
import { InnerContainer } from './styled'

interface PstlWeb3ConnectionModalProps extends Omit<ModalProps, 'isOpen' | 'onDismiss'> {
  title?: string
  theme?: ThemeByModes<BasicUserTheme>
  loaderProps?: LoadingScreenProps
  buttonProps?: ButtonProps
  closeModalOnConnect?: boolean
}

function ModalWithoutThemeProvider({
  title = 'WALLET CONNECTION',
  buttonProps,
  loaderProps,
  maxWidth = '360px',
  maxHeight = '600px',
  closeModalOnConnect = false,
  ...restModalProps
}: Omit<PstlWeb3ConnectionModalProps, 'theme'>) {
  const [connectors, { connect, openW3Modal }, { address, chainId, currentConnector }] = useConnection()
  const { isOpen, close } = usePstlWeb3Modal()

  // flag for setting whether or not web3auth modal has mounted as it takes a few seconds first time around
  // and we want to close the pstlModal only after the web3auth modal has mounted
  const [w3aModalMounted, setW3aModalMounted] = useState(false)
  const [w3aModalLoading, setW3aModalLoading] = useState(false)

  const theme = useTheme()

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
          { chainId, address, isW3aModalMounted: w3aModalMounted, closeOnConnect: closeModalOnConnect }
        )

        return (
          <Fragment key={connector.id + '_' + index}>
            <Button onClick={callback} {...buttonProps}>
              <img style={{ maxWidth: 50 }} src={logo} />
              {connected ? `Connected to ${label}` : `Connect with ${label}`}
            </Button>
            {theme?.modals?.connection?.helpers?.show && <ConnectorHelper connector={connector} />}
          </Fragment>
        )
      }),
    [
      address,
      buttonProps,
      chainId,
      closeModalOnConnect,
      connectors,
      currentConnector,
      theme?.modals?.connection?.helpers?.show,
      w3aModalMounted,
      close,
      connect,
      openW3Modal
    ]
  )

  return (
    <Modal
      className={restModalProps.className}
      isOpen={isOpen}
      onDismiss={close}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      // to prevent locking of focus on modal (with web3auth this blocks using their modal e.g)
      tabIndex={undefined}
      {...restModalProps}
    >
      <InnerContainer justifyContent="flex-start" gap="0.75rem">
        <CloseIcon style={{ position: 'absolute', right: '0.5rem', top: '0.5rem' }} onClick={close} />
        <h1>{title}</h1>
        {w3aModalLoading ? <LoadingScreen {...loaderProps} /> : data}
      </InnerContainer>
    </Modal>
  )
}

function ModalWithThemeProvider({ theme, ...modalProps }: PstlWeb3ConnectionModalProps) {
  const builtTheme = useModalTheme(theme)

  if (!builtTheme) {
    devWarn('[@past3lle/web3-modal::ConnectionModal] No theme detected!')
    return null
  }

  return (
    <ThemeProvider theme={builtTheme}>
      <ModalWithoutThemeProvider {...modalProps} />
    </ThemeProvider>
  )
}

const PstlWeb3ConnectionModal = memo(ModalWithThemeProvider)

export { PstlWeb3ConnectionModal, type PstlWeb3ConnectionModalProps }
