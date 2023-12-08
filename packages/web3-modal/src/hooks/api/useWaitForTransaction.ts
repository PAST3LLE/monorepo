import { Address } from '@past3lle/types'
import { devDebug, wait } from '@past3lle/utils'
import SafeApiKit from '@safe-global/api-kit'
import { useQuery, useWaitForTransaction as useWagmiWaitForTransaction } from 'wagmi'

import { QUERY_KEYS } from '../../constants/queryKeys'
import { useIsSafeViaWc } from '../wallet/useWalletMetadata'
import { useUserConnectionInfo } from './useConnection'

const SAFE_TRANSACTION_SERVICE_CACHE: Partial<Record<number, SafeApiKit | null>> = {}
// Check every 7.5s
const CONFIRMATION_BUFFER_TIME_MS = 7500

export function useWaitForSafeTransaction({
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

      const safeKit = _getSafeKitOrThrow(queryChainId)
      let [executed, txHash] = await _checkSafeTxHasConfirmations(safeKit, hash)

      while (!executed && !txHash) {
        // Call every X seconds
        await wait(CONFIRMATION_BUFFER_TIME_MS)
        devDebug(
          '[@past3lle/web3-modal]::useWaitForSafeTransaction --> Awaiting full confirmations. Checking every',
          CONFIRMATION_BUFFER_TIME_MS / 1000,
          'seconds.'
        )
        const [isConfirmed, transactionHash] = await _checkSafeTxHasConfirmations(safeKit, hash)
        executed = isConfirmed
        txHash = transactionHash
      }

      return txHash
    },
    { queryHash: hash }
  )

  devDebug('Safe Tx Hash from useWaitForSafeTransaction --->', safeTxHash)

  // Wait the normal transaction hash returned from SAFE
  const wagmiWaitResults = useWagmiWaitForTransaction({ ...queryOptions, hash: safeTxHash })

  return {
    ...wagmiWaitResults,
    isLoading: isSafeLoading || wagmiWaitResults.isLoading
  }
}

async function _checkSafeTxHasConfirmations(safeKit: SafeApiKit, hash: Address): Promise<[boolean, Address]> {
  const { isSuccessful, isExecuted, transactionHash } = await safeKit.getTransaction(hash)

  return [Boolean(isSuccessful && isExecuted), transactionHash as Address]
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

function _getClient(chainId: number): SafeApiKit | null {
  const cachedClient = SAFE_TRANSACTION_SERVICE_CACHE[chainId]

  if (cachedClient !== undefined) {
    return cachedClient
  }

  const client = new SafeApiKit({
    chainId: BigInt(chainId)
  })

  // Add client to cache (or null if unknown network)
  SAFE_TRANSACTION_SERVICE_CACHE[chainId] = client

  return client
}

function _getSafeKitOrThrow(chainId: number): SafeApiKit {
  const client = _getClient(chainId)
  if (!client) {
    throw new Error('[@past3lle/web30modal ]Unsupported network for Safe Transaction Service: ' + chainId)
  }

  return client
}
