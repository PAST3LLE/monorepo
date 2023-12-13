import { useWeb3ModalEvents } from '@web3modal/react'

import { useConnectDisconnect } from '../api/useConnection'
import { usePstlWeb3Modal } from '../api/usePstlWeb3Modal'

type Callbacks = {
  onSuccess?: (context: unknown) => void
  onError?: (error: Error) => void
}

export function useConnectDisconnectAndCloseModals(
  shouldClose: boolean,
  connect: Callbacks,
  disconnect: Callbacks
): ReturnType<typeof useConnectDisconnect> {
  const { close } = usePstlWeb3Modal()
  // Close walletconnect modal on detected account/connection changes
  useWeb3ModalEvents((event) => {
    switch (event.name) {
      case 'ACCOUNT_CONNECTED':
        return shouldClose && close()
    }
  })

  // Update global modal state on any errors
  return useConnectDisconnect({
    connect: {
      onSuccess: connect.onSuccess,
      onError: connect.onError
    },
    disconnect: {
      onError: disconnect.onError
    }
  })
}
