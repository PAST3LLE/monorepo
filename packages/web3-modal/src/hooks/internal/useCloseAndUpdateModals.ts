import { useWeb3ModalEvents } from '@web3modal/react'

import { useConnectDisconnect } from '../api/useConnection'
import { usePstlWeb3Modal } from '../api/usePstlWeb3Modal'
import { usePstlWeb3ModalStore } from '../api/usePstlWeb3ModalStore'

type Callbacks = {
  closeModal: ReturnType<typeof usePstlWeb3Modal>['close']
  updateState: ReturnType<typeof usePstlWeb3ModalStore>['updateModalProps']
}

export function useCloseAndUpdateModals(shouldClose: boolean, { closeModal, updateState }: Callbacks) {
  // Close walletconnect modal on detected account/connection changes
  useWeb3ModalEvents((event) => {
    if (event.name === 'ACCOUNT_CONNECTED') {
      shouldClose && closeModal()
    }
  })

  // Update global modal state on any errors
  useConnectDisconnect({
    connect: {
      onSuccess() {
        shouldClose && closeModal()
      },
      onError(error) {
        updateState({
          connect: {
            error
          }
        })
      }
    }
  })
}
