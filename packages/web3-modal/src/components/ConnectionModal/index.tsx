import { ButtonProps, CloseIcon, ErrorBoundary, ModalProps } from '@past3lle/components'
import { useIsExtraSmallMediaWidth } from '@past3lle/hooks'
import { BasicUserTheme, ThemeByModes, ThemeModesRequired, ThemeProvider } from '@past3lle/theme'
import { devWarn } from '@past3lle/utils'
import React, { memo, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'

import { Z_INDICES } from '../../constants'
import { useConnectDisconnect, useModalTheme, useUserConnectionInfo, useWeb3Modals } from '../../hooks'
import { useAutoClearingTimeout } from '../../hooks/useTimeout'
import { WithChainIdFromUrl } from '../../providers/types'
import { ConnectorOverrides } from '../../types'
import { LoadingScreen, LoadingScreenProps } from '../LoadingScreen'
import { ConnectorHelper } from './ConnectorHelper'
import { ErrorModal } from './ErrorModal'
import { RenderConnectorOptions } from './RenderConnectorOptions'
import { ErrorMessageContainer, InnerContainer, ModalTitleText, StyledConnectionModal, WalletsWrapper } from './styled'
import { cleanAndFormatConnectorOverrides, sortConnectorsByRank } from './utils'

/**
 * @name ThemeConfigProps
 * @description PSTL modal theme configuration
 * @property theme - see {@link ThemeByModes}
 * @property mode - see {@link ThemeModesRequired}
 */
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
  /**
   * @name title
   * @description Optional. String header to display on root modal
   */
  title?: string
  /**
   * @name themeConfig
   * @description Optional. PSTL modal theme configuration. See {@link ThemeConfigProps}. 
   * @tip ThemeConfig.mode can be used to sync and external theme mode with modal theme mode.
   * 
   * @example
   interface ThemeConfigProps<
      T extends ThemeByModes<BasicUserTheme> = ThemeByModes<BasicUserTheme>,
      K extends ThemeModesRequired = ThemeModesRequired
    > {
      theme: T
      mode?: K
    }
   */
  themeConfig?: ThemeConfigProps
  /**
   * @name loaderProps
   * @description Optional. Async loader props. For when connector modals are loading.
   */
  loaderProps?: LoadingScreenProps
  /**
   * @name buttonProps
   * @description Optional. Modal connector button style props
   *
   * See {@link ButtonProps}
   */
  buttonProps?: ButtonProps
  /**
   * @name closeModalOnConnect
   * @default false
   * @description Optional. Detect connector activation and auto-close modal on success
   */
  closeModalOnConnect?: boolean
  /**
   * @name hideInjectedFromRoot
   * @description Optional. Hide (potentially) unknown injected wallet from modal root.
   * @default false
   * @tip Useful when explicitly setting InjectedConnector in root and want to control UI
   */
  hideInjectedFromRoot?: boolean
  /**
   * @name walletsView
   * @description Optional. Arrangement of UI elements in modal. "grid" | "list"
   * @default "list"
   * @tip Mobile always shows elements in "list" view
   */
  walletsView?: 'grid' | 'list'
  /**
   * @name connectorDisplayOverrides
   * @description Optional. Key value pair overriding connector info. Displays in root modal. See {@link ConnectorOverrides}
   */
  connectorDisplayOverrides?: ConnectorOverrides
  /**
   * @name zIndex
   * @description Optional. Set root modal z-index. Should be lower than any other modal z-index but greater than underlying app z-indices
   */
  zIndex?: number
}

export type ProviderMountedMap = {
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
  connectorDisplayOverrides: connectorDisplayOverridesUnformatted,
  zIndex = Z_INDICES.PSTL,
  ...restModalProps
}: Omit<PstlWeb3ConnectionModalProps, 'theme'>) {
  const theme = useTheme()
  const isExtraSmallScreen = useIsExtraSmallMediaWidth()
  // We always show list view in tiny screens
  const modalView = isExtraSmallScreen ? 'list' : walletsView

  const modalCallbacks = useWeb3Modals()
  const userConnectionInfo = useUserConnectionInfo()
  const {
    connect: { connectAsync: connect, error }
  } = useConnectDisconnect({
    connect: {
      onSuccess() {
        closeModalOnConnect && modalCallbacks.root.close()
      }
    }
  })

  const connectorDisplayOverrides = useMemo(
    () => cleanAndFormatConnectorOverrides(connectorDisplayOverridesUnformatted),
    [connectorDisplayOverridesUnformatted]
  )

  // flag for setting whether or not web3auth modal has mounted as it takes a few seconds first time around
  // and we want to close the pstlModal only after the web3auth modal has mounted
  const providerMountedState = useState<ProviderMountedMap>({})
  const providerLoadingState = useState(false)

  const showError = useAutoClearingTimeout(!!error, 10_000)

  const data = useMemo(
    () =>
      userConnectionInfo.connectors.sort(sortConnectorsByRank(connectorDisplayOverrides)).map(
        RenderConnectorOptions({
          connectorDisplayOverrides,
          hideInjectedFromRoot,
          chainIdFromUrl,
          buttonProps,
          modalView,
          userConnectionInfo,
          connect,
          modalCallbacks,
          providerMountedState,
          providerLoadingState,
          theme
        })
      ),
    [
      buttonProps,
      chainIdFromUrl,
      connect,
      connectorDisplayOverrides,
      hideInjectedFromRoot,
      modalCallbacks,
      modalView,
      providerLoadingState,
      providerMountedState,
      theme,
      userConnectionInfo
    ]
  )

  return (
    <StyledConnectionModal
      className={restModalProps.className}
      isOpen={modalCallbacks.root.isOpen}
      onDismiss={modalCallbacks.root.close}
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
      <InnerContainer justifyContent="flex-start" gap="0.75rem" isError={showError && !!error?.message}>
        <CloseIcon height={30} width={100} onClick={modalCallbacks.root.close} />
        <ModalTitleText
          fontSize={theme.modals?.connection?.title?.fontSize || '2em'}
          fvs={{
            wght: theme?.modals?.connection?.title?.fontWeight || 200
          }}
          margin="0.2em 0"
        >
          {title}
        </ModalTitleText>
        {connectorDisplayOverrides?.general?.infoText?.content && !providerLoadingState[0] && (
          <ConnectorHelper title={connectorDisplayOverrides.general.infoText?.title || 'What is this?'}>
            {connectorDisplayOverrides?.general.infoText.content}
          </ConnectorHelper>
        )}
        {providerLoadingState[0] ? (
          <LoadingScreen {...loaderProps} />
        ) : (
          <WalletsWrapper view={modalView}>{data}</WalletsWrapper>
        )}

        <ErrorMessageContainer hide={!showError || !error?.message}>
          <p>{error?.message}</p>
        </ErrorMessageContainer>
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
      <ErrorBoundary fallback={<ErrorModal />}>
        <ModalWithoutThemeProvider {...modalProps} />
      </ErrorBoundary>
    </ThemeProvider>
  )
}

const PstlWeb3ConnectionModal = memo(ModalWithThemeProvider)

export { PstlWeb3ConnectionModal, type PstlWeb3ConnectionModalProps }
