import { useEffect } from 'react'

import { ChainsPartialReadonly, PstlWeb3ModalProps } from '../providers'
import { usePstlWeb3ModalState } from './usePstlWeb3ModalState'

export function useHydrateModals<ID extends number, SC extends ChainsPartialReadonly<ID>>(
  rootModalsConfig: PstlWeb3ModalProps<ID, SC>['modals']['root']
) {
  const { updateModalProps } = usePstlWeb3ModalState()

  useEffect(() => {
    updateModalProps({
      root: {
        connectorDisplayOverrides: rootModalsConfig?.connectorDisplayOverrides,
        closeModalOnConnect: rootModalsConfig?.closeModalOnConnect,
        openType: rootModalsConfig?.openType || 'root'
      },
      connect: {
        hideInjectedFromRoot: rootModalsConfig?.hideInjectedFromRoot,
        walletsView: rootModalsConfig?.walletsView,
        error: null
      },
      account: { error: null }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootModalsConfig])
}
