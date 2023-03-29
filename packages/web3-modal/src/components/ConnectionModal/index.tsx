import { ButtonProps, CloseIcon, Modal, ModalProps } from '@past3lle/components'
import { BasicUserTheme, ThemeByModes, ThemeProvider } from '@past3lle/theme'
import { devWarn } from '@past3lle/utils'
import React, { Fragment, ReactNode, memo, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'

import { Z_INDICES } from '../../constants'
import { useConnection, useModalTheme, usePstlWeb3Modal } from '../../hooks'
import { getConnectorInfo } from '../../utils'
import { LoadingScreen, LoadingScreenProps } from '../LoadingScreen'
import { ConnectorHelper } from './ConnectorHelper'
import { InnerContainer, ModalButton } from './styled'

type DefaultWalletNames = 'general' | 'web3auth' | 'walletConnect'
type InfoTextMap = {
  [key in DefaultWalletNames]?: { title: ReactNode; content: ReactNode }
}

interface PstlWeb3ConnectionModalProps extends Omit<ModalProps, 'isOpen' | 'onDismiss'> {
  title?: string
  theme?: ThemeByModes<BasicUserTheme>
  loaderProps?: LoadingScreenProps
  buttonProps?: ButtonProps
  closeModalOnConnect?: boolean
  infoTextMap?: InfoTextMap
  zIndex?: number
}

function ModalWithoutThemeProvider({
  title = 'WALLET CONNECTION',
  buttonProps,
  loaderProps,
  maxWidth = '360px',
  maxHeight = '600px',
  closeModalOnConnect = false,
  infoTextMap,
  zIndex = Z_INDICES.PSTL,
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
            <ModalButton onClick={callback} connected={connected} {...buttonProps}>
              <img style={{ maxWidth: 50 }} src={logo} />
              {connected ? `Connected: ${label}` : `${label} login`}
            </ModalButton>
            {theme?.modals?.connection?.helpers?.show && (
              <ConnectorHelper title={infoTextMap?.[connector.id as DefaultWalletNames]?.title} connector={connector}>
                {infoTextMap?.[connector.id as DefaultWalletNames]?.content}
              </ConnectorHelper>
            )}
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
      infoTextMap,
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
      styleProps={{
        // w3modal has 89 zindex
        zIndex,
        ...restModalProps.styleProps
      }}
      {...restModalProps}
    >
      <InnerContainer justifyContent="flex-start" gap="0.75rem">
        <CloseIcon style={{ position: 'absolute', right: '0.5rem', top: '0.5rem' }} onClick={close} />
        <h1>{title}</h1>
        {infoTextMap?.general && (
          <ConnectorHelper title={infoTextMap.general.title}>{infoTextMap.general.content}</ConnectorHelper>
        )}
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
