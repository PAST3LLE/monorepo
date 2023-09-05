import { useEffect } from 'react'

import { CHAIN_IMAGES } from '../constants'
import { PstlWeb3ModalProps } from '../providers'
import { usePstlWeb3ModalStore } from './usePstlWeb3ModalStore'

export function useHydrateModals<ID extends number>(config: PstlWeb3ModalProps<ID>) {
  const { updateModalProps } = usePstlWeb3ModalStore()

  useEffect(() => {
    const rootConfig = config?.modals?.root
    updateModalProps({
      root: {
        softLimitedChains: config?.callbacks?.softLimitChains?.(config.chains) || config?.chains,
        chainImages: {
          ...CHAIN_IMAGES,
          ...rootConfig?.chainImages
        },
        connectorDisplayOverrides: rootConfig?.connectorDisplayOverrides,
        closeModalOnConnect: rootConfig?.closeModalOnConnect,
        openType: rootConfig?.openType || 'root',
        bypassScrollLock: false
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
