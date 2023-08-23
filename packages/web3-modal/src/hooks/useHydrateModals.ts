import { useEffect } from 'react'

import { PstlWeb3ModalProps } from '../providers'
import { usePstlWeb3ModalState } from './usePstlWeb3ModalState'

export function useHydrateModals<ID extends number>(config: PstlWeb3ModalProps<ID>) {
  const { updateModalProps } = usePstlWeb3ModalState()

  useEffect(() => {
    const rootConfig = config?.modals?.root
    updateModalProps({
      root: {
        softLimitedChains: config?.callbacks?.softLimitChains?.(config.chains) || config?.chains,
        connectorDisplayOverrides: rootConfig?.connectorDisplayOverrides,
        closeModalOnConnect: rootConfig?.closeModalOnConnect,
        openType: rootConfig?.openType || 'root'
      },
      connect: {
        hideInjectedFromRoot: rootConfig?.hideInjectedFromRoot,
        walletsView: rootConfig?.walletsView,
        error: null
      },
      account: { error: null }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])
}
