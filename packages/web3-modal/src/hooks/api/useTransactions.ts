import { useCallback, useEffect, useMemo, useState } from 'react'
import { Address, Hash } from 'viem'
import { useAccount, useChainId } from 'wagmi'

import { TransactionCtrl } from '../../controllers'
import {
  AnyTransactionReceipt,
  TransactionOptions,
  TransactionReceiptPending
} from '../../controllers/TransactionsCtrl/types'
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
  const { address } = useAccount()
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
    transactions: useMemo(
      () => (address ? transactionsByChain?.[chainId]?.[address] || [] : []),
      [address, chainId, transactionsByChain]
    ),
    addTransaction: TransactionCtrl.addTransaction,
    addBatchPendingTransactions: TransactionCtrl.addBatchPendingTransactions,
    confirmTransactionsByValue: TransactionCtrl.confirmTransactionsByValue,
    updateTransactionsByValue: TransactionCtrl.updateTransactionsByValue,
    updateTransactionsBatchByValue: TransactionCtrl.updateTransactionsBatchByValue,
    updateTransactionsViaCallback: TransactionCtrl.updateTransactionsViaCallback
  }
}

export const useTransactionsRead = () => useTransactions().transactions
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
  const { address: account } = useAccount()
  const isSafeWallet = useIsSafeWallet()

  return useCallback(
    (batch: Hash[], nonce = 0, opts?: TransactionOptions) => {
      if (!account || !chainId) return
      else if (opts?.metadataBatch && opts?.metadataBatch?.length !== batch.length) {
        throw new Error('[useAddPendingTransactionsBatch] Metadata batch and hash list length mismatch. Check params.')
      }

      addBatchPendingTransactions({
        account,
        chainId,
        batch,
        nonce,
        walletType: isSafeWallet ? 'SAFE' : 'EOA'
      })
    },
    [isSafeWallet, account, chainId, addBatchPendingTransactions]
  )
}

export const useAddPendingTransaction = () => {
  const { addTransaction } = useTransactions()

  const chainId = useChainId()
  const { address: account } = useAccount()
  const isSafeWallet = useIsSafeWallet()

  return useCallback(
    (hash: Hash, opts?: TransactionOptions) => {
      if (!account || !chainId) return
      const pendingTransaction: TransactionReceiptPending = {
        dateAdded: Date.now(),
        chainId,
        transactionHash: isSafeWallet ? undefined : hash,
        safeTxHash: isSafeWallet ? hash : undefined,
        status: 'pending',
        nonce: 0,
        walletType: isSafeWallet ? 'SAFE' : 'EOA',
        metadata: opts?.metadata
      }

      addTransaction({ account, chainId, transaction: pendingTransaction })
    },
    [account, isSafeWallet, chainId, addTransaction]
  )
}

export const useConfirmTransactionsByPropCallback = () => {
  const { confirmTransactionsByValue } = useTransactions()

  const { address: account } = useAccount()
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
      if (!account || !chainId) return

      confirmTransactionsByValue({
        account,
        chainId,
        searchKey,
        searchValue,
        updateKey
      })
    },
    [account, chainId, confirmTransactionsByValue]
  )
}

export const useUpdateTransactionNonces = () => {
  const { updateTransactionsByValue } = useTransactions()

  const { address: account } = useAccount()
  const chainId = useChainId()

  return useCallback(
    <S extends keyof AnyTransactionReceipt, U extends keyof AnyTransactionReceipt>(
      searchKey: S,
      searchValue: AnyTransactionReceipt[S],
      updateKey: U,
      updateValue: AnyTransactionReceipt[U]
    ) => {
      if (!account || !chainId) return

      updateTransactionsByValue({
        account,
        chainId,
        searchKey,
        searchValue,
        updateKey,
        updateValue
      })
    },
    [account, chainId, updateTransactionsByValue]
  )
}

export const useUpdateBatchTransactionByValue = () => {
  const { updateTransactionsBatchByValue } = useTransactions()
  const { address: account } = useAccount()
  const chainId = useChainId()

  return useCallback(
    <S extends keyof AnyTransactionReceipt, U extends keyof AnyTransactionReceipt>(
      searchKey: S,
      searchValueBatch: AnyTransactionReceipt[S][],
      updateKey: U,
      updateValue: AnyTransactionReceipt[U]
    ) => {
      if (!account || !chainId) return

      updateTransactionsBatchByValue({
        account,
        chainId,
        searchKey,
        searchValueBatch,
        updateKey,
        updateValue
      })
    },
    [account, chainId, updateTransactionsBatchByValue]
  )
}

export const useUpdateTransactionsViaCallback = () => {
  const { updateTransactionsViaCallback } = useTransactions()
  const { address: account } = useAccount()
  const chainId = useChainId()

  return useCallback(
    (updateFn: (state: TransactionsCtrlState[number][Address]) => TransactionsCtrlState[number][Address]) => {
      if (!account || !chainId) return

      updateTransactionsViaCallback({
        account,
        chainId,
        updateFn
      })
    },
    [account, chainId, updateTransactionsViaCallback]
  )
}

export const useTransactionsByMetadataKey = (metaKey: string) => {
  const { transactions } = useTransactions()

  return useMemo(() => transactions.filter((tx) => !!tx?.metadata?.[metaKey]), [metaKey, transactions])
}

export const useTransactionsByMetadataKeyCallback = () => {
  const { transactions } = useTransactions()

  return useCallback((metaKey: string) => transactions.filter((tx) => !!tx?.metadata?.[metaKey]), [transactions])
}

export const useFindTransactionByMetadataKeyValue = (metaKey: string, metaValue: unknown) => {
  const { transactions } = useTransactions()

  return useMemo(
    () => transactions.filter((tx) => !!tx?.metadata?.[metaKey] === metaValue),
    [metaKey, metaValue, transactions]
  )
}

export const useFindTransactionByMetadataKeyValueCallback = () => {
  const { transactions } = useTransactions()

  return useCallback(
    (metaKey: string, metaValue: unknown) => transactions.filter((tx) => !!tx?.metadata?.[metaKey] === metaValue),
    [transactions]
  )
}

// --------- PRIVATE FNS --------------------------------------------- //

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
