import { ButtonProps, CloseIcon, ErrorBoundary, ModalProps } from '@past3lle/components'
import { useIsExtraSmallMediaWidth } from '@past3lle/hooks'
import { BasicUserTheme, ThemeByModes, ThemeModesRequired, ThemeProvider } from '@past3lle/theme'
import { devWarn } from '@past3lle/utils'
import React, { memo, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'
import { useConnect } from 'wagmi'

import { Z_INDICES } from '../../constants'
import { useConnection, useModalTheme } from '../../hooks'
import { useAutoClearingTimeout } from '../../hooks/useTimeout'
import { WithChainIdFromUrl } from '../../providers/types'
import { ConnectorOverrides } from '../../types'
import { LoadingScreen, LoadingScreenProps } from '../LoadingScreen'
import { ConnectorHelper } from './ConnectorHelper'
import { ErrorModal } from './ErrorModal'
import { RenderConnectorOptions } from './RenderConnectorOptions'
import { InnerContainer, ModalTitleText, StyledConnectionModal, WalletsWrapper } from './styled'
import { sortConnectorsByRank } from './utils'

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
  connectorDisplayOverrides?: ConnectorOverrides
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
  connectorDisplayOverrides,
  zIndex = Z_INDICES.PSTL,
  ...restModalProps
}: Omit<PstlWeb3ConnectionModalProps, 'theme'>) {
  const theme = useTheme()
  const isExtraSmallScreen = useIsExtraSmallMediaWidth()
  // We always show list view in tiny screens
  const modalView = isExtraSmallScreen ? 'list' : walletsView

  const connectionState = useConnection()
  const [connectors, { closeRootModal }, { isRootModalOpen }] = connectionState
  const { error } = useConnect({
    onSuccess() {
      closeModalOnConnect && closeRootModal()
    }
  })

  // flag for setting whether or not web3auth modal has mounted as it takes a few seconds first time around
  // and we want to close the pstlModal only after the web3auth modal has mounted
  const providerMountedState = useState<ProviderMountedMap>({})
  const providerLoadingState = useState(false)

  const showError = useAutoClearingTimeout(!!error, 10_000)

  const data = useMemo(
    () =>
      connectors.sort(sortConnectorsByRank(connectorDisplayOverrides)).map(
        RenderConnectorOptions({
          connectorDisplayOverrides,
          hideInjectedFromRoot,
          chainIdFromUrl,
          buttonProps,
          modalView,
          connectionState,
          providerMountedState,
          providerLoadingState,
          theme
        })
      ),
    [
      buttonProps,
      chainIdFromUrl,
      connectionState,
      connectorDisplayOverrides,
      connectors,
      hideInjectedFromRoot,
      modalView,
      providerLoadingState,
      providerMountedState,
      theme
    ]
  )

  return (
    <StyledConnectionModal
      className={restModalProps.className}
      isOpen={isRootModalOpen}
      onDismiss={closeRootModal}
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
        <CloseIcon height={30} width={100} onClick={closeRootModal} />
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
        {showError && error?.message && (
          <p
            style={{
              padding: '1rem',
              width: '90%',
              borderRadius: '0.25rem',
              backgroundColor: '#cd5c5cb3',
              fontVariationSettings: "'wght' 100",
              fontSize: '1rem',
              fontStyle: 'normal'
            }}
          >
            {error.message}
          </p>
        )}
        {providerLoadingState[0] ? (
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
      <ErrorBoundary fallback={<ErrorModal />}>
        <ModalWithoutThemeProvider {...modalProps} />
      </ErrorBoundary>
    </ThemeProvider>
  )
}

const PstlWeb3ConnectionModal = memo(ModalWithThemeProvider)

export { PstlWeb3ConnectionModal, type PstlWeb3ConnectionModalProps }
