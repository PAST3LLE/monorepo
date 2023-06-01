import { useEffect } from 'react'
import { useAccount } from 'wagmi'

/**
 * @name useRefetchOnAddress
 * @param refetchCb refetch callback returned from wagmi contract hook
 */
export function useRefetchOnAddress(refetchCb: (...args: any[]) => void) {
  const { address } = useAccount()
  useEffect(() => {
    refetchCb()
  }, [address, refetchCb])
}
