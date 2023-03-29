import { useEffect, useState } from 'react'

import { ModalCtrl, OptionsCtrl } from '../controllers'

export function usePstlWeb3Modal() {
  const [modal, setModal] = useState(ModalCtrl.state)

  useEffect(() => {
    const unsubscribe = ModalCtrl.subscribe((newModal) => {
      return setModal({ ...newModal })
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return {
    isOpen: modal.open,
    open: ModalCtrl.open,
    close: ModalCtrl.close,
    setDefaultChain: OptionsCtrl.setSelectedChain
  }
}
