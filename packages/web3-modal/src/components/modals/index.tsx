import { ErrorBoundary, SpinnerCircle } from '@past3lle/components'
import { ThemeProvider } from '@past3lle/theme'
import { devWarn } from '@past3lle/utils'
import React, { Suspense, lazy, memo, useEffect, useMemo } from 'react'
import { useSnapshot } from 'valtio'

import { ModalPropsCtrl, RouterCtrl } from '../../controllers'
import { useMergeThemes, usePstlWeb3Modal, usePstlWeb3ModalStore } from '../../hooks'
import { BaseModal } from './common'
import { ModalId, StatelessBaseModalProps } from './common/types'

const AccountModal = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "AccountModal" */ './AccountModal'))
const ConnectionModal = lazy(
  () => import(/* webpackPrefetch: true,  webpackChunkName: "ConnectionModal" */ './ConnectionModal')
)
const ErrorModal = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "ErrorModal" */ './ErrorModal'))
const NetworkModal = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "NetworkModal" */ './NetworkModal'))
const HidDeviceOptionsModal = lazy(
  () => import(/* webpackPrefetch: true,  webpackChunkName: "HidDeviceOptionsModal" */ './HidDeviceOptionsModal')
)

export function ModalWithoutThemeProvider(baseProps: Omit<StatelessBaseModalProps, 'modal'>) {
  const modalState = usePstlWeb3Modal()
  const { resetErrors } = usePstlWeb3ModalStore()
  const view = useSnapshot(RouterCtrl.state).view

  // Reset all error state on view change
  useEffect(() => {
    resetErrors()
  }, [resetErrors, view])

  const [Modal, auxBaseProps] = useMemo(() => {
    switch (view) {
      case 'Account': {
        const props = {
          ...ModalPropsCtrl.state.root,
          error: ModalPropsCtrl.state.account.error
        }
        const augmentedBaseProps: StatelessBaseModalProps = {
          ...baseProps,
          title: baseProps?.headers?.account || 'ACCOUNT',
          width: '650px',
          maxWidth: 'unset',
          minHeight: 'unset',
          maxHeight: 'unset',
          height: 'auto',
          id: ModalId.ACCOUNT,
          modal: 'account'
        }

        return [() => <AccountModal {...props} />, augmentedBaseProps]
      }

      case 'SwitchNetwork':
      case 'SelectNetwork': {
        const augmentedBaseProps: StatelessBaseModalProps = {
          ...baseProps,
          title: baseProps?.headers?.networks || 'NETWORK',
          width: '650px',
          maxWidth: '80vw',
          minHeight: '350px',
          maxHeight: '80vh',
          height: 'auto',
          id: ModalId.NETWORK,
          modal: 'connection'
        }

        return [() => <NetworkModal />, augmentedBaseProps]
      }

      case 'HidDeviceOptions': {
        const props = {
          ...ModalPropsCtrl.state.root,
          ...ModalPropsCtrl.state.hidDeviceOptions
        }
        const augmentedBaseProps: StatelessBaseModalProps = {
          ...baseProps,
          title: 'HID DEVICE OPTIONS',
          width: '650px',
          maxWidth: '80vw',
          minHeight: '350px',
          maxHeight: '80vh',
          height: 'auto',
          id: ModalId.HID_DEVICE_OPTIONS,
          modal: 'hidDevice'
        }

        return [() => <HidDeviceOptionsModal {...props} />, augmentedBaseProps]
      }

      case 'ConnectWallet':
      default: {
        const props = {
          ...ModalPropsCtrl.state.connect,
          ...ModalPropsCtrl.state.root,
          chainIdFromUrl: baseProps.chainIdFromUrl
        }
        const augmentedBaseProps: StatelessBaseModalProps = {
          ...baseProps,
          title: baseProps?.headers?.wallets || baseProps?.title || 'CONNECT',
          width: baseProps.width || props?.walletsView === 'grid' ? '650px' : '50vh',
          maxWidth: baseProps.maxWidth || props?.walletsView === 'grid' ? '100%' : '360px',
          maxHeight: baseProps.maxHeight || props?.walletsView === 'grid' ? '500px' : '600px',
          id: ModalId.WALLETS,
          modal: 'connection'
        }

        return [() => <ConnectionModal {...props} />, augmentedBaseProps]
      }
    }
  }, [baseProps, view])

  return (
    <BaseModal {...baseProps} {...auxBaseProps} isOpen={modalState.isOpen} onDismiss={modalState.close}>
      <Suspense fallback={renderFallback()}>
        <Modal />
      </Suspense>
    </BaseModal>
  )
}

function renderFallback() {
  return <SpinnerCircle size={100} />
}

function ModalWithThemeProvider({ themeConfig, ...modalProps }: Omit<StatelessBaseModalProps, 'modal'>) {
  const builtTheme = useMergeThemes(themeConfig?.theme)

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

const PstlWeb3Modal = memo(ModalWithThemeProvider)

export { PstlWeb3Modal }
