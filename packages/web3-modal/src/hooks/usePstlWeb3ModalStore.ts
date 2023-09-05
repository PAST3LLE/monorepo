import { useCallback, useEffect, useState } from 'react'

import { ModalPropsCtrl } from '../controllers'
import { ModalPropsCtrlState } from '../controllers/types/controllerTypes'

interface PstlWeb3ModalStateHook {
  state: ModalPropsCtrlState
  updateModalProps: (typeof ModalPropsCtrl)['update']
  resetErrors: () => void
}
const NULL_ERROR_STATE = {
  connect: {
    error: null
  },
  account: {
    error: null
  }
}
export function usePstlWeb3ModalStore(): PstlWeb3ModalStateHook {
  const [state, setModalProps] = useState(ModalPropsCtrl.state)

  useEffect(() => {
    const unsubscribeModalPropsState = ModalPropsCtrl.subscribe((newModalProps) => {
      return setModalProps({ ...newModalProps })
    })

    return () => {
      unsubscribeModalPropsState()
    }
  }, [])

  const resetErrors = useCallback(() => ModalPropsCtrl.update(NULL_ERROR_STATE), [])

  return {
    state,
    updateModalProps: ModalPropsCtrl.update,
    resetErrors
  }
}
