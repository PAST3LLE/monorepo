import { Address } from '@past3lle/types'
import { devDebug, wait } from '@past3lle/utils'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  UseWaitForTransactionReceiptParameters,
  UseWaitForTransactionReceiptReturnType,
  useWaitForTransactionReceipt as useWagmiWaitForTransactionReceipt
} from 'wagmi'

import { QUERY_KEYS } from '../../constants/queryKeys'
import { getSafeKitAndTx } from '../../utils/safe'
import { useIsSafeViaWc } from '../wallet/useWalletMetadata'
import { useUserConnectionInfo } from './useConnection'

// Check every 7.5s
const DEFAULT_CONFIRMATION_POLL_TIME = 7500

/**
 * @name useWaitForSafeTransaction
 */
function useWaitForSafeTransaction({ chainId, hash, ...queryOptions }: UseWaitForTransactionReceiptParameters = {}) {
  const { chain, address } = useUserConnectionInfo()
  const queryChainId = chainId || chain?.id

  const { data: safeTxHash, isLoading: isSafeLoading } = useQuery<Address, Error>({
    queryKey: [QUERY_KEYS.SAFE_PENDING_TRANSACTIONS],
    queryFn: async (): Promise<Address> => {
      if (!queryChainId || !address || !hash) {
        throw new Error(
          '[@past3lle/web3-modal] Missing chain id, address, wallet client, or tx hash. Check that you are connected!' +
            ` // Chain ID: ${queryChainId}` +
            ` // Address: ${address}` +
            ` // Safe TX hash: ${hash}`
        )
      }

      let [confirmed] = await getSafeKitAndTx(queryChainId, [hash], address)

      while (!confirmed.transactionHash) {
        // Call every X seconds
        await wait(DEFAULT_CONFIRMATION_POLL_TIME)
        devDebug(
          '[@past3lle/web3-modal]::useWaitForSafeTransaction --> Awaiting full confirmations. Checking every',
          DEFAULT_CONFIRMATION_POLL_TIME / 1000,
          'seconds.'
        )
        const [confirmedInner] = await getSafeKitAndTx(queryChainId, [hash], address)
        confirmed = confirmedInner
      }

      return confirmed.transactionHash
    },
    enabled: !!hash,
    queryHash: hash
  })

  devDebug('Safe Tx Hash from useWaitForSafeTransaction --->', safeTxHash)

  // Wait the normal transaction hash returned from SAFE
  const wagmiWaitResults = useWagmiWaitForTransactionReceipt({ ...queryOptions, hash: safeTxHash })

  return {
    ...wagmiWaitResults,
    isLoading: isSafeLoading || wagmiWaitResults.isLoading
  }
}

/**
 * @name useWaitForTransaction
 * @description extends wagmi hook of same name but checks Safe transactions
 * @example
 * import { useWaitForTransaction } from '@past3lle/web3-modal'
 *
 * useWaitForTransaction({
 *  chainId: 1,
 *  hash: '0x...',
 * })
 */
export function useWaitForTransaction(props: UseWaitForTransactionReceiptParameters) {
  const isWCSafeWallet = useIsSafeViaWc()

  const normalResults = useWagmiWaitForTransactionReceipt({ ...props, query: { enabled: !isWCSafeWallet } })
  const safeResults = useWaitForSafeTransaction({ ...props, query: { enabled: isWCSafeWallet } })

  return isWCSafeWallet ? safeResults : normalResults
}

export function useWaitForTransactionReceiptEffect({
  hash,
  enabled,
  onSettled,
  onReplaced
}: UseWaitForTransactionReceiptParameters & {
  onSettled: (
    data: UseWaitForTransactionReceiptReturnType['data'],
    error: UseWaitForTransactionReceiptReturnType['error']
  ) => void
  enabled: boolean
}) {
  // Watch EOA transactions
  const results = useWagmiWaitForTransactionReceipt({
    hash,
    query: {
      enabled
    },
    onReplaced
  })

  useEffect(() => {
    if (!enabled) return
    onSettled(results?.data, results?.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results?.data, results?.error, onSettled, enabled])

  return results
}
