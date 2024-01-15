import { devDebug, devError } from '@past3lle/utils'
import isEqual from 'lodash.isequal'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Address, Chain } from 'viem'
import { watchPendingTransactions } from 'viem/actions'
import { UseWatchPendingTransactionsParameters, useConfig } from 'wagmi'

import { AuxSafeTransaction, TransactionReceiptPending } from '../../controllers/TransactionsCtrl/types'
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
  safeTxInfo?: Pick<AuxSafeTransaction, 'confirmations' | 'confirmationsRequired' | 'replacedReason'>
}
export type SafeTransactionListenerInfo = SimpleTxInfo[]

export type WatchPendingTransactionsListener = (txs: Address[], safeTxInfo: SafeTransactionListenerInfo) => void
export type WatchPendingTransactionsErrorListener = (
  error: Error | undefined,
  safeTxInfo: SafeTransactionListenerInfo
) => void

export function useWatchPendingTransactions(
  params: Omit<UseWatchPendingTransactionsParameters, 'listener'> & {
    enabled: boolean
    safeTxHashes?: Address[]
    listener: WatchPendingTransactionsListener
    errorListener?: WatchPendingTransactionsErrorListener
  }
): void {
  useEnhancedWatchPendingTransactions({
    ...params,
    safeTxHashes: params.safeTxHashes
  })
}

/**
 * @name useWatchPendingSafeTransactions
 */
function useEnhancedWatchPendingTransactions({
  safeTxHashes,
  enabled,
  listener,
  errorListener
}: Omit<UseWatchPendingTransactionsParameters, 'listener'> & {
  listener: WatchPendingTransactionsListener
  errorListener?: WatchPendingTransactionsErrorListener
  safeTxHashes?: Address[]
}) {
  const [, setData] = useState<WatchPendingTransactionReturn['data'] | undefined>()
  const [, setError] = useState<Error | undefined>()
  const [, setStatus] = useState<WatchPendingTransactionReturn['status']>('idle')

  useEffect(() => {
    setData(safeTxHashes)
  }, [safeTxHashes])

  const { address, chain } = useUserConnectionInfo()

  const { getClient } = useConfig()

  const handleTxConfirmed = useCallback(
    (status: Status) => {
      setStatus(status === 'replaced' ? 'replace-confirmed' : 'confirmed')
      setData(undefined)
      setError(undefined)
    },
    [setStatus, setData, setError]
  )
  const handleError = useCallback(
    (e: any) => {
      const error = new Error(e)
      devError('[@past3lle/web3-modal] Error in useWatchPendingTransactions: ', error)
      setStatus('error')
      setData(undefined)
      setError(error)

      throw error
    },
    [setStatus, setData, setError]
  )
  const transactionsRef = useRef<SimpleTxInfo[] | null>(null)
  useEffect(() => {
    if (!address || !enabled || !chain?.id) {
      return devDebug(
        '[@past3lle/web3-modal -- useWatchPendingTransactions] No address // chain id // pending transactions detected. Bailing.'
      )
    }

    const callbacks = {
      handleTxConfirmed,
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

    const unsub = watchPendingTransactions(getClient(), {
      poll: true,
      onTransactions: auxListener,
      async onError(error) {
        devError(
          '[@past3lle/web3-modal -- useWatchPendingTransactions] Error watching transactions:',
          error?.message || error,
          'Checking transaction status...'
        )
        let results: SafeTransactionListenerInfo = []
        if (safeTxHashes?.length) {
          results = await _handleSafeTransactions(safeTxHashes, transactionsRef, state, callbacks)
        }
        errorListener?.(error, results)
      }
    })
    devDebug('[@past3lle/web3-modal -- useWatchPendingTransactions] Subbing!')

    return () => {
      devDebug('[@past3lle/web3-modal -- useWatchPendingTransactions] Unsubbing!')
      unsub()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chain?.id, enabled, getClient])
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
    handleError: (e: any) => void
  }
): Promise<SimpleTxInfo[]> {
  try {
    const transactions = await getSafeKitAndTx(state.chain.id, safeTxHashes, state.address)
    const dataChanged = !isEqual(transactions, transactionsRef.current)

    if (dataChanged) transactionsRef.current = transactions

    return transactions
  } catch (e: any) {
    listenerCallbacks.handleError(e)
    throw new Error(e)
  }
}
