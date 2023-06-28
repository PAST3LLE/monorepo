import { ButtonProps, CloseIcon, ErrorBoundary, ModalProps } from '@past3lle/components'
import { useIsExtraSmallMediaWidth } from '@past3lle/hooks'
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
import { InnerContainer, ModalButton, ModalTitleText, StyledConnectionModal, WalletsWrapper } from './styled'

interface ThemeConfigProps<
  T extends ThemeByModes<BasicUserTheme> = ThemeByModes<BasicUserTheme>,
  K extends ThemeModesRequired = ThemeModesRequired
> {
  theme: T
  mode?: K
}
interface PstlWeb3ConnectionModalProps
  extends Omit<ModalProps, 'isLargeImageModal' | 'isOpen' | 'onDismiss'>,
    WithChainIdFromUrl {
  title?: string
  themeConfig?: ThemeConfigProps
  loaderProps?: LoadingScreenProps
  buttonProps?: ButtonProps
  closeModalOnConnect?: boolean
  hideInjectedFromRoot?: boolean
  walletsView?: 'grid' | 'list'
  connectorDisplayOverrides?: { [id: string]: ConnectorEnhancedExtras | undefined }
  zIndex?: number
}

type ProviderMountedMap = {
  [id: string]: {
    mounted: boolean
  }
}

function ModalWithoutThemeProvider({
  chainIdFromUrl,
  title = 'WALLET CONNECTION',
  walletsView = 'list',
  buttonProps,
  loaderProps,
  width = walletsView === 'grid' ? '650px' : '50vh',
  maxWidth = walletsView === 'grid' ? '100%' : '360px',
  maxHeight = walletsView === 'grid' ? '500px' : '600px',
  closeModalOnConnect = false,
  hideInjectedFromRoot = false,
  connectorDisplayOverrides,
  zIndex = Z_INDICES.PSTL,
  ...restModalProps
}: Omit<PstlWeb3ConnectionModalProps, 'theme'>) {
  const isExtraSmallScreen = useIsExtraSmallMediaWidth()
  // We always show list view in tiny screens
  const modalView = isExtraSmallScreen ? 'list' : walletsView
  const [connectors, { connect, openW3Modal }, { address, chain, currentConnector }] = useConnection()
  const { isOpen, close } = usePstlWeb3Modal()

  // flag for setting whether or not web3auth modal has mounted as it takes a few seconds first time around
  // and we want to close the pstlModal only after the web3auth modal has mounted
  const [providerMountedMap, setProviderMountedMap] = useState<ProviderMountedMap>({})
  const [providerLoading, setProviderLoading] = useState(false)

  const theme = useTheme()

  const data = useMemo(
    () =>
      connectors
        .sort((connA, connB) => {
          const connA_rank =
            (connectorDisplayOverrides?.[connA.id] || connectorDisplayOverrides?.[connA.name])?.rank || 0
          const connB_rank =
            (connectorDisplayOverrides?.[connB.id] || connectorDisplayOverrides?.[connB.name])?.rank || 0

          return connB_rank - connA_rank
        })
        .map((connector, index) => {
          if (hideInjectedFromRoot && connector.id === 'injected') return null
          const [{ label, logo, connected, isRecommended }, callback] = getConnectorInfo(
            connector,
            currentConnector,
            {
              connect,
              openW3Modal,
              closePstlModal: close,
              setProviderModalMounted: (mounted: boolean) =>
                setProviderMountedMap((currState) => ({
                  ...currState,
                  [connector.id]: { ...currState[connector.id], mounted }
                })),
              setProviderModaLoading: setProviderLoading
            },
            {
              chainId: chainIdFromUrl || chain?.id,
              address,
              isProviderModalMounted: !!providerMountedMap?.[connector.id]?.mounted,
              closeOnConnect: closeModalOnConnect,
              connectorDisplayOverrides
            }
          )

          const showHelperText = theme?.modals?.connection?.helpers?.show
          const helperContent = (
            connectorDisplayOverrides?.[connector.id] || connectorDisplayOverrides?.[connector.name]
          )?.infoText

          return (
            <Fragment key={connector.id + '_' + index}>
              <ModalButton onClick={callback} connected={connected} {...buttonProps}>
                <img src={logo} />
                {label}
                {connected && <ConnectedCheckMark />}
                {isRecommended && <RecommendedLabel />}
              </ModalButton>
              {modalView !== 'grid' && showHelperText && !!helperContent?.content && (
                <ConnectorHelper title={helperContent.title} connector={connector}>
                  {helperContent.content}
                </ConnectorHelper>
              )}
            </Fragment>
          )
        }),
    [
      modalView,
      connectors,
      currentConnector,
      connect,
      openW3Modal,
      close,
      chainIdFromUrl,
      chain?.id,
      address,
      providerMountedMap,
      closeModalOnConnect,
      hideInjectedFromRoot,
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
      width={width}
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
        {connectorDisplayOverrides?.general?.infoText?.content && !providerLoading && (
          <ConnectorHelper title={connectorDisplayOverrides.general.infoText?.title || 'What is this?'}>
            {connectorDisplayOverrides?.general.infoText.content}
          </ConnectorHelper>
        )}
        {providerLoading ? (
          <LoadingScreen {...loaderProps} />
        ) : (
          <WalletsWrapper view={modalView}>{data}</WalletsWrapper>
        )}
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
      <ErrorBoundary fallback={<h1>AH WOOPSEH DEHHHSEESHHHH</h1>}>
        <ModalWithoutThemeProvider {...modalProps} />
      </ErrorBoundary>
    </ThemeProvider>
  )
}

const PstlWeb3ConnectionModal = memo(ModalWithThemeProvider)

export { PstlWeb3ConnectionModal, type PstlWeb3ConnectionModalProps }
