import { devDebug, devError } from '@past3lle/utils'
import { useCallback, useMemo } from 'react'
import { Address, Hash, Transaction } from 'viem'

import { UserOptionsTransactionsCallbacks } from '../../../controllers/types'
import {
  SafeTransactionListenerInfo,
  useWaitForTransactionReceiptEffect,
  useWatchPendingTransactions
} from '../../../hooks'
import { usePendingTxHashListByType, useUpdateTransactionsViaCallback } from '../../../hooks/api/useTransactions'
import { useUserOptionsTransactionCallbacks } from '../../../hooks/internal/useUserOptionsTransactionCallbacks'
import { AnyTransactionReceipt } from '../types'

export function TransactionsUpdater() {
  const userTransactionCallbacks = useUserOptionsTransactionCallbacks()
  const updateTransactionsViaCallback = useUpdateTransactionsViaCallback()
  const { eoa: pendingEoaHashList, safe: pendingSafeHashList } = usePendingTxHashListByType()

  const { eoaReversed, safeReversed } = useMemo(() => {
    return {
      eoaReversed: pendingEoaHashList?.slice()?.reverse(),
      safeReversed: pendingSafeHashList?.slice()?.reverse()
    }
  }, [pendingEoaHashList, pendingSafeHashList])

  /* 
    SCENARIOS FOR TRANSACTIONS
    1. User creates a new tx on client side
      a. every new tx in mempool, check tx hash is there
      b. when tx hash not found in mempool = mined
    
    2. User edits/overwrites/cancels tx on wallet side
      a. we shouldn't really care about this as it's not the wallet's (on the client side app) responsibility to know external txs not related to consuming app
      b. so we can ignore/mark as reverted
  */
  const listener = useCallback(
    (_: Address[], transactions: SafeTransactionListenerInfo) => {
      if (!!pendingSafeHashList.length) {
        _handleSafeTransactions(transactions, updateTransactionsViaCallback, userTransactionCallbacks)
      }
    },
    [pendingSafeHashList.length, updateTransactionsViaCallback, userTransactionCallbacks]
  )
  const errorListener = useCallback(
    (_: Error | undefined, transactions: SafeTransactionListenerInfo) => {
      if (!!pendingSafeHashList.length) {
        _handleSafeTransactions(transactions, updateTransactionsViaCallback, userTransactionCallbacks)
      }
    },
    [pendingSafeHashList.length, updateTransactionsViaCallback, userTransactionCallbacks]
  )

  const memoedSafeHashes = useMemo(() => safeReversed.map((tx) => tx.safeTxHash), [safeReversed])
  // Watch SAFE transactions
  useWatchPendingTransactions({
    enabled: !!memoedSafeHashes.length,
    safeTxHashes: memoedSafeHashes,
    listener,
    errorListener
  })
  // Watch EOA transactions
  useWaitForTransactionReceiptEffect({
    enabled: !!eoaReversed?.[0]?.transactionHash,
    hash: eoaReversed?.[0]?.transactionHash,
    onSettled(data, error) {
      if (data?.transactionHash) {
        updateTransactionsViaCallback(
          _setTxState(data.transactionHash, userTransactionCallbacks?.onEoaTransactionConfirmed, {
            status: 'success'
          })
        )
      } else if (error) {
        devError('[TransactionsCtrl::Updater] EOA transaction tracking error!', error?.message || error)
        updateTransactionsViaCallback(
          _setTxState(eoaReversed?.[0]?.transactionHash, userTransactionCallbacks?.onEoaTransactionUnknown, {
            status: 'unknown'
          })
        )
      } else {
        devDebug('[TransactionsCtrl::Updater] No transaction hash in onSettled callback!')
      }
    },
    async onReplaced(response) {
      devDebug(
        '[TransactionsCtrl::Updater] Transaction',
        response.replacedTransaction.hash,
        'replaced! New transaction:',
        response.transaction,
        ' // Reason:',
        response.reason
      )
      updateTransactionsViaCallback(
        _setTxState(eoaReversed?.[0]?.transactionHash, userTransactionCallbacks?.onEoaTransactionUnknown, {
          status: 'replaced-pending'
        })
      )
    }
  })

  return null
}

function _handleSafeTransactions(
  transactions: SafeTransactionListenerInfo,
  updateTransactionsViaCallback: ReturnType<typeof useUpdateTransactionsViaCallback>,
  userTransactionCallbacks?: UserOptionsTransactionsCallbacks
) {
  return updateTransactionsViaCallback((state = []) =>
    state.map((tx) => {
      const ctx = transactions.find((actx) => actx.safeTxHash === tx.safeTxHash)
      const nonceLookAhead = ctx?.nonce
        ? state.find((stateTx) => ctx?.nonce && stateTx.nonce === ctx.nonce + 1)
        : undefined
      const auxTx = !!ctx?.transactionHash
        ? userTransactionCallbacks?.onSafeTransactionConfirmed?.(tx)
        : !!nonceLookAhead?.transactionHash
        ? userTransactionCallbacks?.onSafeTransactionReverted?.(tx)
        : undefined
      return !!ctx
        ? {
            ...tx,
            ...auxTx,
            status: !!ctx.transactionHash
              ? 'success'
              : ctx.safeTxInfo?.replacedReason === 'repriced'
              ? 'replaced-success'
              : !!nonceLookAhead?.transactionHash ||
                ctx.safeTxInfo?.replacedReason === 'replaced' ||
                ctx.safeTxInfo?.replacedReason === 'cancelled'
              ? 'reverted'
              : 'pending',
            replaceReason: ctx.safeTxInfo?.replacedReason,
            nonce: ctx.nonce,
            transactionHash: ctx.transactionHash,
            safeTxInfo: ctx.safeTxInfo
          }
        : tx
    })
  )
}

const _setTxState =
  (
    hashInQuestion: Hash,
    callback: ((tx: AnyTransactionReceipt) => AnyTransactionReceipt) | undefined,
    txState?: Partial<AnyTransactionReceipt>,
    txInfo?: Transaction
  ) =>
  (state: AnyTransactionReceipt[] | undefined = []): AnyTransactionReceipt[] => {
    return state.map((tx) => {
      const isTxToConfirm = txInfo ? tx.transactionHash === txInfo.hash : hashInQuestion === tx.transactionHash
      const auxTx = isTxToConfirm ? callback?.(tx) : undefined
      return isTxToConfirm
        ? {
            ...tx,
            ...auxTx,
            ...txState
          }
        : tx
    })
  }
