import { useEffect } from 'react'
import { Chain, mainnet } from 'wagmi'

import { CHAIN_IMAGES } from '../../constants'
import { PstlWeb3ModalProps } from '../../providers'
import { ConnectorEnhanced, ConnectorOverrides } from '../../types'
import { usePstlWeb3ModalStore } from '../api/usePstlWeb3ModalStore'

export function useUpdateUserConfigState<ID extends number>(config: PstlWeb3ModalProps<ID>) {
  const {
    callbacks: {
      userOptions: { set }
    }
  } = usePstlWeb3ModalStore()
  useEffect(() => {
    const rootConfig = config?.modals?.root
    set({
      ux: {
        appType: config.options?.escapeHatches?.appType,
        bypassScrollLock: false,
        closeModalOnConnect: rootConfig?.closeModalOnConnect
      },
      ui: {
        chainImages: {
          ...CHAIN_IMAGES,
          ...rootConfig?.chainImages
        },
        softLimitedChains: config?.callbacks?.softLimitChains?.(config.chains) || config?.chains,
        walletsView: rootConfig?.walletsView
      },
      connectors: {
        hideInjectedFromRoot: rootConfig?.hideInjectedFromRoot,
        overrides: _getConnectorOverrides(config?.connectors)
      },
      transactions: config.callbacks?.transactions
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])
}

function _getConnectorOverrides(connectors: PstlWeb3ModalProps['connectors']) {
  if (!connectors || Array.isArray(connectors)) return undefined
  else if (Array.isArray(connectors?.overrides)) {
    return connectors.overrides.reduce((acc, next, i) => {
      const id = (connectors?.connectors as ((chains: Chain[]) => ConnectorEnhanced<any, any>)[])?.[i]?.([mainnet]).id
      acc[id] = next
      return acc
    }, {} as ConnectorOverrides)
  }

  return connectors?.overrides
}
