import { useEffect, useState } from 'react'

import { ModalCtrl } from '../controllers'

interface PstlWeb3ModalHook {
  isOpen: boolean
  open: (typeof ModalCtrl)['open']
  close: (typeof ModalCtrl)['close']
}
export function usePstlWeb3Modal(): PstlWeb3ModalHook {
  const [modal, setModal] = useState(ModalCtrl.state)

  useEffect(() => {
    const unsubscribeModalState = ModalCtrl.subscribe((newModal) => {
      return setModal({ ...newModal })
    })

    return () => {
      unsubscribeModalState()
    }
  }, [])

  return {
    isOpen: modal.open,
    open: ModalCtrl.open,
    close: ModalCtrl.close
  }
}
