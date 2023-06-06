import { useEffect } from 'react'
import { useAccount } from 'wagmi'

import { useSupportedChainId } from './useSkillForgeSupportedChainId'

/**
 * @name useRefetchOnAddressAndChain
 * @param refetchCb refetch callback returned from wagmi contract hook
 */
export function useRefetchOnAddressAndChain(refetchCb: (...args: any[]) => void) {
  const { address } = useAccount()
  const chain = useSupportedChainId()
  useEffect(() => {
    refetchCb()
  }, [address, chain, refetchCb])
}
