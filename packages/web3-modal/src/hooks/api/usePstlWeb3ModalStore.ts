import { useCallback, useEffect, useState } from 'react'

import { ConnectionStatusCtrl, ModalCtrl, UserOptionsCtrl } from '../../controllers'
import { ConnectionStatusCtrlState, ModalCtrlState, UserOptionsCtrlState } from '../../controllers/types'

interface PstlWeb3ModalStateHook {
  state: {
    modal: ModalCtrlState
    connectionStatus: ConnectionStatusCtrlState
    userOptions: UserOptionsCtrlState
  }
  callbacks: {
    open: (typeof ModalCtrl)['open']
    close: (typeof ModalCtrl)['close']
    error: {
      set: (typeof ModalCtrl)['setError']
      reset: () => void
    }
    connectionStatus: {
      set: (typeof ConnectionStatusCtrl)['update']
      reset: (typeof ConnectionStatusCtrl)['reset']
      retry: (typeof ConnectionStatusCtrl)['retryConnection']
    }
    userOptions: {
      set: (typeof UserOptionsCtrl)['update']
    }
  }
}

export function usePstlWeb3ModalStore(): PstlWeb3ModalStateHook {
  const [modalState, setModalState] = useState(ModalCtrl.state)
  const [connectionStatusState, setConnectionStatusState] = useState(ConnectionStatusCtrl.state)
  const [userOptionsState, setUserOptionsState] = useState(UserOptionsCtrl.state)

  useEffect(() => {
    const unsubscribeModalState = ModalCtrl.subscribe((state) => {
      return setModalState({ ...state })
    })
    const unsubscribeConnectionStatusState = ConnectionStatusCtrl.subscribe((state) => {
      return setConnectionStatusState({ ...state })
    })
    const unsubscribeUserOptionsState = UserOptionsCtrl.subscribe((state) => {
      return setUserOptionsState({ ...state })
    })

    return () => {
      unsubscribeModalState()
      unsubscribeConnectionStatusState()
      unsubscribeUserOptionsState()
    }
  }, [])

  const resetError = useCallback(() => ModalCtrl.resetError(), [])

  return {
    state: {
      modal: modalState,
      connectionStatus: connectionStatusState,
      userOptions: userOptionsState
    },
    callbacks: {
      open: ModalCtrl.open,
      close: ModalCtrl.close,
      error: {
        set: ModalCtrl.setError,
        reset: resetError
      },
      userOptions: {
        set: UserOptionsCtrl.update
      },
      connectionStatus: {
        set: ConnectionStatusCtrl.update,
        reset: ConnectionStatusCtrl.reset,
        retry: ConnectionStatusCtrl.retryConnection
      }
    }
  }
}
