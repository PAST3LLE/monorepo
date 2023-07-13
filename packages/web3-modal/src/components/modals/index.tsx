import { ErrorBoundary } from '@past3lle/components'
import { ThemeProvider } from '@past3lle/theme'
import { devWarn } from '@past3lle/utils'
import React, { memo, useMemo } from 'react'
import { useSnapshot } from 'valtio'

import { ModalPropsCtrl, RouterCtrl } from '../../controllers'
import { useModalTheme, usePstlWeb3Modal } from '../../hooks'
import { AccountModal } from './AccountModal'
import { ConnectionModal } from './ConnectionModal'
import { ErrorModal } from './ErrorModal'
import { NetworkModal } from './NetworkModal'
import { BaseModal } from './common'
import { BaseModalProps } from './common/types'

export function ModalWithoutThemeProvider(baseProps: BaseModalProps) {
  const modalState = usePstlWeb3Modal()
  const view = useSnapshot(RouterCtrl.state).view

  const [Modal, auxBaseProps] = useMemo(() => {
    switch (view) {
      case 'Account': {
        const props = {
          ...ModalPropsCtrl.state.root,
          error: ModalPropsCtrl.state.account.error
        }
        const augmentedBaseProps: BaseModalProps = {
          ...baseProps,
          title: 'ACCOUNT',
          width: '650px',
          maxWidth: 'unset',
          minHeight: 'unset',
          maxHeight: 'unset',
          height: 'auto'
        }

        return [() => <AccountModal {...props} />, augmentedBaseProps]
      }

      case 'SwitchNetwork':
      case 'SelectNetwork': {
        const augmentedBaseProps: BaseModalProps = {
          ...baseProps,
          title: 'NETWORK',
          width: '450px',
          maxWidth: '80vw',
          minHeight: '350px',
          maxHeight: '80vh',
          height: 'auto'
        }

        return [() => <NetworkModal />, augmentedBaseProps]
      }

      case 'ConnectWallet':
      default: {
        const props = {
          ...ModalPropsCtrl.state.connect,
          ...ModalPropsCtrl.state.root,
          chainIdFromUrl: baseProps.chainIdFromUrl
        }
        const augmentedBaseProps = {
          ...baseProps,
          width: baseProps.width || props?.walletsView === 'grid' ? '650px' : '50vh',
          maxWidth: baseProps.maxWidth || props?.walletsView === 'grid' ? '100%' : '360px',
          maxHeight: baseProps.maxHeight || props?.walletsView === 'grid' ? '500px' : '600px'
        }

        return [() => <ConnectionModal {...props} />, augmentedBaseProps]
      }
    }
  }, [baseProps, view])

  return (
    <BaseModal {...baseProps} {...auxBaseProps} isOpen={modalState.isOpen} onDismiss={modalState.close}>
      <Modal />
    </BaseModal>
  )
}

function ModalWithThemeProvider({ themeConfig, ...modalProps }: any) {
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

const PstlWeb3Modal = memo(ModalWithThemeProvider)

export { PstlWeb3Modal }
