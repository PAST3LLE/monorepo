import { Address } from '@past3lle/types'
import { devDebug, wait } from '@past3lle/utils'
import { useQuery, useWaitForTransaction as useWagmiWaitForTransaction } from 'wagmi'

import { QUERY_KEYS } from '../../constants/queryKeys'
import { getSafeKitAndTx } from '../../utils/safe'
import { useIsSafeViaWc } from '../wallet/useWalletMetadata'
import { useUserConnectionInfo } from './useConnection'

// Check every 7.5s
const DEFAULT_CONFIRMATION_POLL_TIME = 7500

/**
 * @name useWaitForSafeTransaction
 */
function useWaitForSafeTransaction({
  chainId,
  hash,
  ...queryOptions
}: Parameters<typeof useWagmiWaitForTransaction>[0] = {}) {
  const { chain, address } = useUserConnectionInfo()
  const queryChainId = chainId || chain?.id

  const { data: safeTxHash, isLoading: isSafeLoading } = useQuery<Address, Error>(
    [QUERY_KEYS.SAFE_PENDING_TRANSACTIONS],
    async (): Promise<Address> => {
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
    {
      enabled: !!hash,
      queryHash: hash
    }
  )

  devDebug('Safe Tx Hash from useWaitForSafeTransaction --->', safeTxHash)

  // Wait the normal transaction hash returned from SAFE
  const wagmiWaitResults = useWagmiWaitForTransaction({ ...queryOptions, hash: safeTxHash })

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
export function useWaitForTransaction(props: Parameters<typeof useWagmiWaitForTransaction>[0]) {
  const isWCSafeWallet = useIsSafeViaWc()

  const normalResults = useWagmiWaitForTransaction({ ...props, enabled: !isWCSafeWallet })
  const safeResults = useWaitForSafeTransaction({ ...props, enabled: isWCSafeWallet })

  return isWCSafeWallet ? safeResults : normalResults
}
