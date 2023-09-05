import { useCallback, useEffect, useState } from 'react'

import { ModalPropsCtrl } from '../controllers'
import { ModalPropsCtrlState } from '../controllers/types/controllerTypes'

interface PstlWeb3ModalStateHook {
  modalProps: ModalPropsCtrlState
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
export function usePstlWeb3ModalState(): PstlWeb3ModalStateHook {
  const [modalProps, setModalProps] = useState(ModalPropsCtrl.state)

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
    modalProps,
    updateModalProps: ModalPropsCtrl.update,
    resetErrors
  }
}
