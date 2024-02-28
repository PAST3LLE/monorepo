import { useCallback, useMemo } from 'react'

import { connectorOverridePropSelector } from '../../utils/misc'
import { useUserConnectionInfo } from '../api/useConnection'
import { usePstlWeb3ModalStore } from '../api/usePstlWeb3ModalStore'

export function useConnectedChainAndWalletIcon() {
  const userConnectionInfo = useUserConnectionInfo()
  const {
    state: {
      userOptions: { connectors, ui }
    }
  } = usePstlWeb3ModalStore()

  return useMemo(() => {
    const baseProp = connectorOverridePropSelector(connectors?.overrides, userConnectionInfo.connector)
    return {
      // TODO: remove this logo for icon in next major
      wallet: baseProp?.logo || baseProp?.icon,
      chain: userConnectionInfo?.chain?.id ? ui?.chainImages?.[userConnectionInfo.chain.id] : undefined
    }
  }, [connectors?.overrides, ui?.chainImages, userConnectionInfo.chain?.id, userConnectionInfo.connector])
}

export const useConnectedChainIcon = () => useConnectedChainAndWalletIcon().chain
export const useConnectedWalletIcon = () => useConnectedChainAndWalletIcon().wallet

export const useGetChainIconCallback = () => {
  const {
    state: {
      userOptions: { ui }
    }
  } = usePstlWeb3ModalStore()
  return useCallback(
    (chainId?: number) => (chainId ? ui?.chainImages?.[chainId] ?? ui?.chainImages?.unknown : undefined),
    [ui?.chainImages]
  )
}
