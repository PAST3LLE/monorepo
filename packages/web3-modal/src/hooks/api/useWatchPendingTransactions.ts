import { devError } from '@past3lle/utils'
import { SafeMultisigTransactionListResponse } from '@safe-global/api-kit'
import isEqual from 'lodash.isequal'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Address,
  Chain,
  usePublicClient,
  type useWatchPendingTransactions as useWagmiWatchPendingTransactions,
  useWebSocketPublicClient
} from 'wagmi'

import { TransactionReceiptPending } from '../../controllers/TransactionsCtrl/types'
import { getSafeKitAndTx } from '../../utils/safe'
import { useUserConnectionInfo } from './useConnection'

export type Status = 'confirmed' | 'loading' | 'error' | 'idle' | 'replaced' | 'replace-confirmed'
interface WatchPendingTransactionReturn {
  data?: Address[]
  error?: Error
  status: Status
  isError: boolean
  isIdle: boolean
  isLoading: boolean
}

export type SimpleTxInfo = Pick<TransactionReceiptPending, 'transactionHash' | 'safeTxHash' | 'nonce'> & {
  safeTxInfo?: Pick<SafeMultisigTransactionListResponse['results'][number], 'confirmations' | 'confirmationsRequired'>
}
export type SafeTransactionListenerInfo = SimpleTxInfo[]

export type WatchPendingTransactionsListener = (txs: Address[], safeTxInfo: SafeTransactionListenerInfo) => void

export function useWatchPendingTransactions(
  params: Omit<Parameters<typeof useWagmiWatchPendingTransactions>[0], 'listener'> & {
    safeTxHashes?: Address[]
    listener: WatchPendingTransactionsListener
  }
): WatchPendingTransactionReturn {
  const [data, setData] = useState<WatchPendingTransactionReturn['data'] | undefined>()
  const [error, setError] = useState<Error | undefined>()
  const [status, setStatus] = useState<WatchPendingTransactionReturn['status']>('idle')

  useEffect(() => {
    setData(params?.safeTxHashes)
  }, [params?.safeTxHashes])

  useEnhancedWatchPendingTransactions({
    ...params,
    safeTxHashes: data,
    store: {
      status,
      setError,
      setData,
      setStatus
    }
  })

  return useMemo(
    () => ({
      data,
      error,
      status,
      isError: !!error,
      isLoading: status === 'loading' || status === 'replaced',
      get isIdle() {
        return !this.isLoading && !error
      }
    }),
    [data, error, status]
  )
}

/**
 * @name useWatchPendingSafeTransactions
 */
function useEnhancedWatchPendingTransactions({
  chainId,
  safeTxHashes,
  enabled,
  listener,
  store
}: Omit<Parameters<typeof useWagmiWatchPendingTransactions>[0], 'listener'> & {
  listener: WatchPendingTransactionsListener
  safeTxHashes?: Address[]
  store: {
    status: Status
    setData: (data: WatchPendingTransactionReturn['data']) => void
    setError: (e: Error | undefined) => void
    setStatus: React.Dispatch<React.SetStateAction<Status>>
  }
}) {
  const { address, chain } = useUserConnectionInfo()
  const queryChainId = chainId || chain?.id

  const publicClient = usePublicClient({ chainId: queryChainId })
  const webSocketPublicClient = useWebSocketPublicClient({ chainId: queryChainId })

  const handleTxConfirmed = useCallback(
    (status: Status) => {
      store.setStatus(status === 'replaced' ? 'replace-confirmed' : 'confirmed')
      store.setData(undefined)
      store.setError(undefined)
    },
    [store]
  )
  const handleTxReplaced = useCallback(
    (_hashes: SimpleTxInfo[]) => {
      store.setStatus('replaced')
      // TODO: fix by nonce
      // hashes.forEach((hashList, nonce) => store.setData(hashList))
    },
    [store]
  )
  const handleError = useCallback(
    (e: any) => {
      const error = new Error(e)
      devError('[@past3lle/web3-modal] Error in useWatchPendingTransactions: ', error)
      store.setStatus('error')
      store.setData(undefined)
      store.setError(error)

      throw error
    },
    [store]
  )
  const transactionsRef = useRef<SimpleTxInfo[] | null>(null)
  useEffect(() => {
    if (!address || !enabled || !chain?.id) return
    // We're calling this first time, set loading

    const callbacks = {
      handleTxConfirmed,
      handleTxReplaced,
      handleError
    }
    const state = {
      chain,
      address
    }

    const auxListener = async (txs: Address[]) => {
      let results: SafeTransactionListenerInfo = []
      if (safeTxHashes?.length) {
        results = await _handleSafeTransactions(safeTxHashes, transactionsRef, state, callbacks)
      }

      listener(txs, results)
    }

    const publicClient_ = webSocketPublicClient ?? publicClient

    return publicClient_.watchPendingTransactions({
      onTransactions: auxListener
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, listener, publicClient, webSocketPublicClient, store.status, chain?.id, safeTxHashes])
}

async function _handleSafeTransactions(
  safeTxHashes: Address[],
  transactionsRef: React.MutableRefObject<SimpleTxInfo[] | null>,
  state: {
    chain: Chain
    address: Address
  },
  listenerCallbacks: {
    handleTxConfirmed: (status: Status) => void
    handleTxReplaced: (txs: SimpleTxInfo[]) => void
    handleError: (e: any) => void
  }
): Promise<SimpleTxInfo[]> {
  try {
    const transactions = await getSafeKitAndTx(state.chain.id, safeTxHashes, state.address)

    const dataChanged = !isEqual(transactions, transactionsRef.current)

    if (dataChanged) {
      // TODO: fix by nonce
      transactions.length && listenerCallbacks.handleTxReplaced(transactions)
      transactionsRef.current = transactions
    }

    return transactions
  } catch (e: any) {
    listenerCallbacks.handleError(e)
    throw new Error(e)
  }
}
