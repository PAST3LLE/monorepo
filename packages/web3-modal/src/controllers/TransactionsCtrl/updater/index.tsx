import { devDebug, devError } from '@past3lle/utils'
import { fetchTransaction } from '@wagmi/core'
import { useCallback, useEffect, useMemo } from 'react'
import { Hash } from 'viem'
import { Address } from 'wagmi'

import { UserOptionsTransactionsCallbacks } from '../../../controllers/types'
import { SafeTransactionListenerInfo, useWatchPendingTransactions } from '../../../hooks'
import { usePendingTxHashListByType, useUpdateTransactionsViaCallback } from '../../../hooks/api/useTransactions'
import { useUserOptionsTransactionCallbacks } from '../../../hooks/internal/useUserOptionsTransactionCallbacks'
import { TransactionCtrl } from '../state'
import { AnyTransactionReceipt } from '../types'

export function TransactionsUpdater() {
  const userTransactionCallbacks = useUserOptionsTransactionCallbacks()
  const updateTransactionsViaCallback = useUpdateTransactionsViaCallback()
  const { eoa: pendingEoaHashList, safe: pendingSafeHashList } = usePendingTxHashListByType()

  // TODO: remove
  useEffect(() => {
    ;(window as any).addTransaction = TransactionCtrl.addTransaction
    ;(window as any).addPendingTransactions = TransactionCtrl.addBatchPendingTransactions
    ;(window as any).confirmTransactionsByProp = TransactionCtrl.confirmTransactionsByValue
    ;(window as any).updateTransactionNoncesBatch = TransactionCtrl.updateTransactionsBatchByValue
    ;(window as any).updateTransactionsViaCallback = TransactionCtrl.updateTransactionsViaCallback
  }, [])

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
    (txPool: Address[], transactions: SafeTransactionListenerInfo) => {
      if (!!pendingSafeHashList.length && !!transactions.length) {
        _handleSafeTransactions(transactions, updateTransactionsViaCallback, userTransactionCallbacks)
      }
      // Has EOA pending txs
      else if (!!pendingEoaHashList.length) {
        _handleEoaTransactions(txPool, pendingEoaHashList, updateTransactionsViaCallback, userTransactionCallbacks)
      }
    },
    [pendingEoaHashList, pendingSafeHashList.length, updateTransactionsViaCallback, userTransactionCallbacks]
  )

  useWatchPendingTransactions({
    enabled: !!pendingSafeHashList.length || !!pendingEoaHashList.length,
    safeTxHashes: useMemo(() => pendingSafeHashList.map((tx) => tx.safeTxHash), [pendingSafeHashList]),
    listener,
    errorListener: () =>
      _handleEoaTransactions(undefined, pendingEoaHashList, updateTransactionsViaCallback, userTransactionCallbacks)
  })

  return null
}

function _handleEoaTransactions(
  txPool: Hash[] | undefined,
  pendingEoaHashList: AnyTransactionReceipt<'EOA'>[],
  updateTransactionsViaCallback: ReturnType<typeof useUpdateTransactionsViaCallback>,
  userTransactionCallbacks?: UserOptionsTransactionsCallbacks
) {
  pendingEoaHashList.forEach((pendingTx) => {
    fetchTransaction({
      chainId: pendingTx.chainId,
      hash: pendingTx.transactionHash
    })
      .then((txInfo) => {
        // Scenario 1 ==>
        // We didn't find the pending hash in the mempool
        // But we have an available blockhash in the tx info response (mined)
        const isMined = !txPool?.includes(pendingTx.transactionHash) && !!txInfo.blockHash
        if (isMined) {
          devDebug('[@past3lle/web3-modal] Hash', txInfo, 'not found in current mempool. Must be mined.')
          !!txInfo &&
            updateTransactionsViaCallback((state = []) =>
              state.map((tx) => {
                const isTxToConfirm = tx.transactionHash === txInfo.hash
                const auxTx = isTxToConfirm ? userTransactionCallbacks?.onEoaTransactionConfirmed?.(tx) : undefined
                return isTxToConfirm
                  ? {
                      ...tx,
                      ...auxTx,
                      status: 'success',
                      nonce: txInfo.transactionIndex || 0
                    }
                  : tx
              })
            )
        } else if (txPool?.includes(pendingTx.transactionHash)) {
          devDebug(
            '[@past3lle/web3-modal] Hash',
            pendingTx.transactionHash,
            'still in current mempool. Checking if reverted.'
          )
          updateTransactionsViaCallback((state = []) =>
            state.map((tx, idx) => {
              if (tx.status === 'success') return tx

              const isTxToConfirm =
                tx.transactionHash === txInfo?.['hash'] || tx.transactionHash === pendingTx.transactionHash
              const lookAheadTx = state[idx + 1]
              const shouldRevert = !txInfo || (isTxToConfirm && lookAheadTx.status === 'success')
              const auxTx = isTxToConfirm
                ? userTransactionCallbacks?.onEoaTransactionConfirmed?.(tx)
                : userTransactionCallbacks?.onEoaTransactionReverted?.(tx)
              return {
                ...tx,
                ...auxTx,
                status: shouldRevert ? 'reverted' : tx.status,
                nonce: shouldRevert && txInfo ? txInfo['nonce'] : tx.nonce
              }
            })
          )
        }
      })
      .catch((e) => {
        devError('[@past3lle/web3-modal] Tx @ hash', pendingTx, 'not found. Status unknown. Error:', e)
        // TODO: fix "unknown" status with "reverted" when we can better implement overwritten transaction statuses
        updateTransactionsViaCallback((state = []) =>
          state.map((tx) => {
            const txToUpdate =
              (tx?.transactionHash || tx?.safeTxHash) === (pendingTx?.transactionHash || pendingTx?.safeTxHash)
            if (tx.status === 'success' || !txToUpdate) return tx

            const auxTx = userTransactionCallbacks?.onEoaTransactionUnknown?.(tx)
            return {
              ...tx,
              ...auxTx,
              status: 'unknown'
            }
          })
        )
      })
  })
}

function _handleSafeTransactions(
  transactions: SafeTransactionListenerInfo,
  updateTransactionsViaCallback: ReturnType<typeof useUpdateTransactionsViaCallback>,
  userTransactionCallbacks?: UserOptionsTransactionsCallbacks
) {
  return updateTransactionsViaCallback((state = []) =>
    state.map((tx) => {
      const ctx = transactions.find((actx) => actx.safeTxHash === tx.safeTxHash)
      const nonceLookAhead = ctx?.nonce ? state.find((stateTx) => stateTx.nonce === ctx.nonce + 1) : undefined
      const auxTx = !!ctx?.transactionHash
        ? userTransactionCallbacks?.onSafeTransactionConfirmed?.(tx)
        : !!nonceLookAhead?.transactionHash
        ? userTransactionCallbacks?.onSafeTransactionReverted?.(tx)
        : undefined
      return !!ctx
        ? {
            ...tx,
            ...auxTx,
            status: !!ctx.transactionHash ? 'success' : !!nonceLookAhead?.transactionHash ? 'reverted' : 'pending',
            nonce: ctx.nonce,
            transactionHash: ctx.transactionHash,
            safeTxInfo: ctx.safeTxInfo
          }
        : tx
    })
  )
}
