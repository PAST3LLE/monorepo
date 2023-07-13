import { useEffect, useState } from 'react'
import { ModalPropsCtrlState } from 'src/controllers/types/controllerTypes'

import { ModalPropsCtrl } from '../controllers'

interface PstlWeb3ModalStateHook {
  modalProps: ModalPropsCtrlState
  updateModalProps: (typeof ModalPropsCtrl)['update']
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

  return {
    modalProps,
    updateModalProps: ModalPropsCtrl.update
  }
}
