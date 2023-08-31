import { useCallback, useMemo } from 'react'

import { trimAndLowerCase } from '../utils'
import { useUserConnectionInfo } from './useConnection'
import { usePstlWeb3ModalState } from './usePstlWeb3ModalState'

export function useConnectedChainAndWalletLogo() {
  const userConnectionInfo = useUserConnectionInfo()
  const {
    modalProps: { root }
  } = usePstlWeb3ModalState()

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
    modalProps: { root }
  } = usePstlWeb3ModalState()
  return useCallback(
    (chainId: number) => (chainId ? root.chainImages?.[chainId] ?? root.chainImages?.unknown : undefined),
    [root?.chainImages]
  )
}
