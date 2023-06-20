import { ButtonProps, CloseIcon, ModalProps } from '@past3lle/components'
import { BasicUserTheme, ThemeByModes, ThemeModesRequired, ThemeProvider } from '@past3lle/theme'
import { devWarn } from '@past3lle/utils'
import React, { Fragment, memo, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'

import { Z_INDICES } from '../../constants'
import { useConnection, useModalTheme, usePstlWeb3Modal } from '../../hooks'
import { WithChainIdFromUrl } from '../../providers/types'
import { ConnectorEnhancedExtras } from '../../types'
import { getConnectorInfo } from '../../utils'
import { LoadingScreen, LoadingScreenProps } from '../LoadingScreen'
import { ConnectedCheckMark } from './ConnectedCheckMark'
import { ConnectorHelper } from './ConnectorHelper'
import { RecommendedLabel } from './RecommendedLabel'
import { InnerContainer, ModalButton, ModalTitleText, StyledConnectionModal } from './styled'

interface ThemeConfigProps<
  T extends ThemeByModes<BasicUserTheme> = ThemeByModes<BasicUserTheme>,
  K extends ThemeModesRequired = ThemeModesRequired
> {
  theme: T
  mode?: K
}
interface PstlWeb3ConnectionModalProps extends Omit<ModalProps, 'isOpen' | 'onDismiss'>, WithChainIdFromUrl {
  title?: string
  themeConfig?: ThemeConfigProps
  loaderProps?: LoadingScreenProps
  buttonProps?: ButtonProps
  closeModalOnConnect?: boolean
  connectorDisplayOverrides?: { [id: string]: ConnectorEnhancedExtras | undefined }
  zIndex?: number
}

function ModalWithoutThemeProvider({
  chainIdFromUrl,
  title = 'WALLET CONNECTION',
  buttonProps,
  loaderProps,
  maxWidth = '360px',
  maxHeight = '600px',
  closeModalOnConnect = false,
  connectorDisplayOverrides,
  zIndex = Z_INDICES.PSTL,
  ...restModalProps
}: Omit<PstlWeb3ConnectionModalProps, 'theme'>) {
  const [connectors, { connect, openW3Modal }, { address, chain, currentConnector }] = useConnection()
  const { isOpen, close } = usePstlWeb3Modal()

  // flag for setting whether or not web3auth modal has mounted as it takes a few seconds first time around
  // and we want to close the pstlModal only after the web3auth modal has mounted
  const [w3aModalMounted, setW3aModalMounted] = useState(false)
  const [w3aModalLoading, setW3aModalLoading] = useState(false)

  const theme = useTheme()

  const data = useMemo(
    () =>
      connectors.slice(0, 2).map((connector, index) => {
        const [{ label, logo, connected, isRecommended }, callback] = getConnectorInfo(
          connector,
          currentConnector,
          {
            connect,
            openW3Modal,
            closePstlModal: close,
            setW3aModalMounted,
            setW3aModalLoading
          },
          {
            chainId: chainIdFromUrl || chain?.id,
            address,
            isW3aModalMounted: w3aModalMounted,
            closeOnConnect: closeModalOnConnect,
            connectorDisplayOverrides
          }
        )

        return (
          <Fragment key={connector.id + '_' + index}>
            <ModalButton onClick={callback} connected={connected} {...buttonProps}>
              <img style={{ maxWidth: 50 }} src={logo} />
              {label}
              {connected && <ConnectedCheckMark />}
              {isRecommended && <RecommendedLabel />}
            </ModalButton>
            {theme?.modals?.connection?.helpers?.show && (
              <ConnectorHelper title={connectorDisplayOverrides?.[connector.id]?.infoText?.title} connector={connector}>
                {connectorDisplayOverrides?.[connector.id]?.infoText?.content}
              </ConnectorHelper>
            )}
          </Fragment>
        )
      }),
    [
      connectors,
      currentConnector,
      connect,
      openW3Modal,
      close,
      chainIdFromUrl,
      chain?.id,
      address,
      w3aModalMounted,
      closeModalOnConnect,
      connectorDisplayOverrides,
      buttonProps,
      theme?.modals?.connection?.helpers?.show
    ]
  )

  return (
    <StyledConnectionModal
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
        <CloseIcon height={30} width={100} onClick={close} />
        <ModalTitleText
          fontSize={theme.modals?.connection?.title?.fontSize || '2em'}
          fvs={{
            wght: theme?.modals?.connection?.title?.fontWeight || 200
          }}
          margin="0.2em 0"
        >
          {title}
        </ModalTitleText>
        {connectorDisplayOverrides?.general?.infoText?.content && !w3aModalLoading && (
          <ConnectorHelper title={connectorDisplayOverrides.general.infoText?.title || 'What is this?'}>
            {connectorDisplayOverrides?.general.infoText.content}
          </ConnectorHelper>
        )}
        {w3aModalLoading ? <LoadingScreen {...loaderProps} /> : data}
      </InnerContainer>
    </StyledConnectionModal>
  )
}

function ModalWithThemeProvider({ themeConfig, ...modalProps }: PstlWeb3ConnectionModalProps) {
  const builtTheme = useModalTheme(themeConfig?.theme)

  if (!builtTheme) {
    devWarn('[@past3lle/web3-modal::ConnectionModal] No theme detected!')
    return null
  }

  return (
    <ThemeProvider theme={builtTheme} mode={themeConfig?.mode}>
      <ModalWithoutThemeProvider {...modalProps} />
    </ThemeProvider>
  )
}

const PstlWeb3ConnectionModal = memo(ModalWithThemeProvider)

export { PstlWeb3ConnectionModal, type PstlWeb3ConnectionModalProps }
