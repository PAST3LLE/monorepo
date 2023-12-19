import { useCallback, useEffect, useMemo, useState } from 'react'
import { Hash } from 'viem'
import { useChainId } from 'wagmi'

import { TransactionCtrl } from '../../controllers'
import { AnyTransactionReceipt, TransactionReceiptPending } from '../../controllers/TransactionsCtrl/types'
import { TransactionsCtrlState } from '../../controllers/types'
import { useIsSafeWallet } from '../wallet/useWalletMetadata'

interface UseTransactions {
  transactions: AnyTransactionReceipt[]
  addTransaction: typeof TransactionCtrl.addTransaction
  addBatchPendingTransactions: typeof TransactionCtrl.addBatchPendingTransactions
  confirmTransactionsByValue: typeof TransactionCtrl.confirmTransactionsByValue
  updateTransactionsByValue: typeof TransactionCtrl.updateTransactionsByValue
  updateTransactionsBatchByValue: typeof TransactionCtrl.updateTransactionsBatchByValue
  updateTransactionsViaCallback: typeof TransactionCtrl.updateTransactionsViaCallback
}
export function useTransactions(): UseTransactions {
  const chainId = useChainId()
  const [transactionsByChain, setState] = useState(TransactionCtrl.state)

  useEffect(() => {
    const unsubscribeTransactionState = TransactionCtrl.subscribe((newState) => {
      return setState({ ...newState })
    })

    return () => {
      unsubscribeTransactionState()
    }
  }, [])

  return {
    transactions: useMemo(() => transactionsByChain[chainId] || [], [chainId, transactionsByChain]),
    addTransaction: TransactionCtrl.addTransaction,
    addBatchPendingTransactions: TransactionCtrl.addBatchPendingTransactions,
    confirmTransactionsByValue: TransactionCtrl.confirmTransactionsByValue,
    updateTransactionsByValue: TransactionCtrl.updateTransactionsByValue,
    updateTransactionsBatchByValue: TransactionCtrl.updateTransactionsBatchByValue,
    updateTransactionsViaCallback: TransactionCtrl.updateTransactionsViaCallback
  }
}

export const usePendingTransactions = () => {
  const { transactions } = useTransactions()

  return useMemo(() => transactions.filter(getIsTxPending) as AnyTransactionReceipt[], [transactions])
}

export const usePendingSafeTransactions = () => {
  const { transactions } = useTransactions()

  return useMemo(() => transactions.filter(getIsSafeTxPending) as AnyTransactionReceipt<'SAFE'>[], [transactions])
}

export const usePendingEoaTransactions = () => {
  const { transactions } = useTransactions()

  return useMemo(() => transactions.filter(getIsEoaPending) as AnyTransactionReceipt<'EOA'>[], [transactions])
}

export const usePendingTxHashListByType = (): {
  eoa: AnyTransactionReceipt<'EOA'>[]
  safe: AnyTransactionReceipt<'SAFE'>[]
} => {
  const pendingSafeTxList = usePendingSafeTransactions()
  const pendingEoaTxList = usePendingEoaTransactions()

  return useMemo(
    () => ({
      eoa: pendingEoaTxList,
      safe: pendingSafeTxList
    }),
    [pendingEoaTxList, pendingSafeTxList]
  )
}

export const useHasPendingTransactions = () => {
  const { transactions } = useTransactions()
  return useMemo(() => transactions?.some(getIsTxPending), [transactions])
}

export const useAddPendingTransactionsBatch = () => {
  const { addBatchPendingTransactions } = useTransactions()

  const chainId = useChainId()
  const isSafeWallet = useIsSafeWallet()

  return useCallback(
    (batch: Hash[], nonce = 0) => {
      if (!chainId) return

      addBatchPendingTransactions({
        chainId,
        batch,
        nonce,
        walletType: isSafeWallet ? 'SAFE' : 'EOA'
      })
    },
    [isSafeWallet, chainId, addBatchPendingTransactions]
  )
}

export const useAddPendingTransaction = () => {
  const { addTransaction } = useTransactions()

  const chainId = useChainId()
  const isSafeWallet = useIsSafeWallet()

  return useCallback(
    (hash: Hash) => {
      if (!chainId) return
      const pendingTransaction: TransactionReceiptPending = {
        chainId,
        transactionHash: isSafeWallet ? undefined : hash,
        safeTxHash: isSafeWallet ? hash : undefined,
        status: 'pending',
        nonce: 0,
        walletType: isSafeWallet ? 'SAFE' : 'EOA'
      }

      addTransaction({ chainId, transaction: pendingTransaction })
    },
    [isSafeWallet, chainId, addTransaction]
  )
}

export const useConfirmTransactionsByPropCallback = () => {
  const { confirmTransactionsByValue } = useTransactions()

  const chainId = useChainId()

  return useCallback(
    <
      S extends keyof Omit<AnyTransactionReceipt, 'dateAdded'>,
      U extends keyof Omit<AnyTransactionReceipt, 'dateAdded'>
    >(
      searchKey: S,
      searchValue: AnyTransactionReceipt[S],
      updateKey: U
    ) => {
      if (!chainId) return

      confirmTransactionsByValue({
        chainId,
        searchKey,
        searchValue,
        updateKey
      })
    },
    [chainId, confirmTransactionsByValue]
  )
}

export const useUpdateTransactionNonces = () => {
  const { updateTransactionsByValue } = useTransactions()

  const chainId = useChainId()

  return useCallback(
    <S extends keyof AnyTransactionReceipt, U extends keyof AnyTransactionReceipt>(
      searchKey: S,
      searchValue: AnyTransactionReceipt[S],
      updateKey: U,
      updateValue: AnyTransactionReceipt[U]
    ) => {
      if (!chainId) return

      updateTransactionsByValue({
        chainId,
        searchKey,
        searchValue,
        updateKey,
        updateValue
      })
    },
    [chainId, updateTransactionsByValue]
  )
}

export const useUpdateBatchTransactionByValue = () => {
  const { updateTransactionsBatchByValue } = useTransactions()
  const chainId = useChainId()

  return useCallback(
    <S extends keyof AnyTransactionReceipt, U extends keyof AnyTransactionReceipt>(
      searchKey: S,
      searchValueBatch: AnyTransactionReceipt[S][],
      updateKey: U,
      updateValue: AnyTransactionReceipt[U]
    ) => {
      if (!chainId) return

      updateTransactionsBatchByValue({
        chainId,
        searchKey,
        searchValueBatch,
        updateKey,
        updateValue
      })
    },
    [chainId, updateTransactionsBatchByValue]
  )
}

export const useUpdateTransactionsViaCallback = () => {
  const { updateTransactionsViaCallback } = useTransactions()
  const chainId = useChainId()

  return useCallback(
    (updateFn: (state: TransactionsCtrlState[number]) => TransactionsCtrlState[number]) => {
      if (!chainId) return

      updateTransactionsViaCallback({
        chainId,
        updateFn
      })
    },
    [chainId, updateTransactionsViaCallback]
  )
}

// --------- FNS --------------------------------------------- //

function getTxStatus(tx: AnyTransactionReceipt) {
  return tx.status
}

function getIsTxPending(tx: AnyTransactionReceipt) {
  const status = getTxStatus(tx)
  return status === 'pending' || status === 'replaced-pending'
}

function getIsSafeTxPending(tx: AnyTransactionReceipt) {
  return tx.walletType === 'SAFE' && getIsTxPending(tx)
}

function getIsEoaPending(tx: AnyTransactionReceipt) {
  return tx.walletType !== 'SAFE' && getIsTxPending(tx)
}
