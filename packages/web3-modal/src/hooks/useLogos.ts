import { useCallback, useMemo } from 'react'

import { trimAndLowerCase } from '../utils/misc'
import { useUserConnectionInfo } from './useConnection'
import { usePstlWeb3ModalStore } from './usePstlWeb3ModalStore'

export function useConnectedChainAndWalletLogo() {
  const userConnectionInfo = useUserConnectionInfo()
  const {
    state: { root }
  } = usePstlWeb3ModalStore()

  return useMemo(
    () => ({
      wallet: (
        root?.connectorDisplayOverrides?.[trimAndLowerCase(userConnectionInfo.connector?.id)] ||
        root?.connectorDisplayOverrides?.[trimAndLowerCase(userConnectionInfo.connector?.name)]
      )?.logo,
      chain: userConnectionInfo?.chain?.id ? root.chainImages?.[userConnectionInfo.chain.id] : undefined
    }),
    [
      root?.connectorDisplayOverrides,
      root?.chainImages,
      userConnectionInfo.chain?.id,
      userConnectionInfo.connector?.id,
      userConnectionInfo.connector?.name
    ]
  )
}

export const useConnectedChainLogo = () => useConnectedChainAndWalletLogo().chain
export const useConnectedWalletLogo = () => useConnectedChainAndWalletLogo().wallet

export const useGetChainLogoCallback = () => {
  const {
    state: { root }
  } = usePstlWeb3ModalStore()
  return useCallback(
    (chainId: number) => (chainId ? root.chainImages?.[chainId] ?? root.chainImages?.unknown : undefined),
    [root?.chainImages]
  )
}
