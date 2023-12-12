import { useCallback, useMemo } from 'react'

import { connectorOverridePropSelector } from '../../utils/misc'
import { useUserConnectionInfo } from '../api/useConnection'
import { usePstlWeb3ModalStore } from '../api/usePstlWeb3ModalStore'

export function useConnectedChainAndWalletLogo() {
  const userConnectionInfo = useUserConnectionInfo()
  const {
    state: {
      userOptions: { connectors, ui }
    }
  } = usePstlWeb3ModalStore()

  return useMemo(
    () => ({
      wallet: connectorOverridePropSelector(connectors?.overrides, userConnectionInfo.connector)?.logo,
      chain: userConnectionInfo?.chain?.id ? ui?.chainImages?.[userConnectionInfo.chain.id] : undefined
    }),
    [connectors?.overrides, ui?.chainImages, userConnectionInfo.chain?.id, userConnectionInfo.connector]
  )
}

export const useConnectedChainLogo = () => useConnectedChainAndWalletLogo().chain
export const useConnectedWalletLogo = () => useConnectedChainAndWalletLogo().wallet

export const useGetChainLogoCallback = () => {
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
