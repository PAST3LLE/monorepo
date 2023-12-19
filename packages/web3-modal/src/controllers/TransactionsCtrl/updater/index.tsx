import { devDebug, devError } from '@past3lle/utils'
import { waitForTransaction } from '@wagmi/core'
import { useCallback, useEffect, useMemo } from 'react'
import { Address } from 'wagmi'

import { SafeTransactionListenerInfo, useWatchPendingTransactions } from '../../../hooks'
import { usePendingTxHashListByType, useUpdateTransactionsViaCallback } from '../../../hooks/api/useTransactions'
import { TransactionCtrl } from '../state'

export function TransactionsUpdater() {
  const updateTransactionsViaCallback = useUpdateTransactionsViaCallback()
  const { eoa: pendingEoaHashList, safe: pendingSafeHashList } = usePendingTxHashListByType()

  // TODO: remove
  useEffect(() => {
    ;(window as any).addTransaction = TransactionCtrl.addTransaction
    ;(window as any).addPendingTransactions = TransactionCtrl.addBatchPendingTransactions
    ;(window as any).confirmTransactionsByProp = TransactionCtrl.confirmTransactionsByValue
    ;(window as any).updateTransactionNoncesBatch = TransactionCtrl.updateTransactionsBatchByValue
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
        updateTransactionsViaCallback((state = []) =>
          state.map((tx, idx) => {
            const ctx = transactions.find((actx) => actx.safeTxHash === tx.safeTxHash)
            const ctxAhead = state[idx + 1]
            return !!ctx
              ? {
                  ...tx,
                  status: !!ctx.transactionHash ? 'success' : !!ctxAhead?.transactionHash ? 'reverted' : 'pending',
                  nonce: ctx.nonce,
                  transactionHash: ctx.transactionHash
                }
              : tx
          })
        )
      }
      // Has EOA pending txs
      else if (!!pendingEoaHashList.length) {
        pendingEoaHashList.forEach(async (pendingTx) => {
          const txInfo = await waitForTransaction({
            chainId: pendingTx.chainId,
            hash: pendingTx.transactionHash,
            onReplaced(response) {
              devDebug(
                '[@past3lle/web3-modal] Hash',
                txInfo?.transactionHash || 'n/a',
                'detected to have been changed with reason:',
                response.reason,
                'New hash:',
                response.replacedTransaction.hash
              )

              updateTransactionsViaCallback((state = []) =>
                state.map((tx) => {
                  const isTxToConfirm = tx.transactionHash === response.replacedTransaction.hash
                  return {
                    ...tx,
                    transactionHash: response.transactionReceipt.transactionHash,
                    status: isTxToConfirm ? 'replaced-success' : tx.status,
                    replaceReason: response.reason,
                    nonce: isTxToConfirm ? response.transactionReceipt.transactionIndex : tx.nonce
                  }
                })
              )
            }
          }).catch((e) => {
            devError('[@past3lle/web3-modal] Tx @ hash', pendingTx, 'not found. Likely reverted. Error:', e)
            // return null
          })
          const minedAndNeedsUpdate = !!txInfo && !txPool.includes(pendingTx.transactionHash)
          if (minedAndNeedsUpdate) {
            devDebug('[@past3lle/web3-modal] Hash', txInfo, 'not found in current mempool. Must be mined.')
            updateTransactionsViaCallback((state = []) =>
              state.map((tx) => {
                const isTxToConfirm = tx.transactionHash === txInfo['transactionHash']
                return {
                  ...tx,
                  status: isTxToConfirm ? 'success' : tx.status,
                  nonce: isTxToConfirm ? txInfo['transactionIndex'] : tx.nonce
                }
              })
            )
          } else {
            devDebug(
              '[@past3lle/web3-modal] Hash',
              pendingTx.transactionHash,
              'still in current mempool. Checking if reverted.'
            )
            updateTransactionsViaCallback((state = []) =>
              state.map((tx, idx) => {
                if (tx.status === 'success') return tx

                const isTxToConfirm =
                  tx.transactionHash === txInfo?.['transactionHash'] || tx.transactionHash === pendingTx.transactionHash
                const lookAheadTx = state[idx + 1]
                const shouldRevert = !txInfo || (isTxToConfirm && lookAheadTx.status === 'success')
                return {
                  ...tx,
                  status: shouldRevert ? 'reverted' : tx.status,
                  nonce: shouldRevert && txInfo ? txInfo['transactionIndex'] : tx.nonce
                }
              })
            )
          }
        })
      }
    },
    [pendingEoaHashList, pendingSafeHashList.length, updateTransactionsViaCallback]
  )

  useWatchPendingTransactions({
    enabled: !!pendingSafeHashList.length || !!pendingEoaHashList.length,
    safeTxHashes: useMemo(() => pendingSafeHashList.map((tx) => tx.safeTxHash), [pendingSafeHashList]),
    listener
  })

  return null
}
