import { SafeMultisigTransactionListResponse } from '@safe-global/api-kit'
import { Hash, ReplacementReason, TransactionReceipt as TransactionReceiptViem } from 'viem'

interface BaseTransactionReceipt<T extends 'SAFE' | 'EOA' = 'SAFE' | 'EOA'> {
  chainId?: number
  status: 'success' | 'reverted' | 'pending' | 'replaced-pending' | 'replaced-success' | 'unknown'
  replaceReason?: ReplacementReason
  // ms (Date.now())
  dateAdded: number
  metadata?: TransactionOptions['metadata']
  safeTxInfo?: T extends 'SAFE'
    ? Pick<SafeMultisigTransactionListResponse['results'][number], 'confirmations' | 'confirmationsRequired'>
    : void
}

export interface TransactionReceiptPending<T extends 'SAFE' | 'EOA' = 'SAFE' | 'EOA'>
  extends BaseTransactionReceipt<T> {
  nonce: number
  walletType: T
  safeTxHash: T extends 'SAFE' ? Hash : void
  transactionHash: T extends 'SAFE' ? Hash | undefined : Hash
  replacementTransactionHashes?: Hash[]
}

export type TransactionReceipt<T extends 'SAFE' | 'EOA' = 'SAFE' | 'EOA'> = BaseTransactionReceipt<T> &
  Omit<TransactionReceiptViem, 'status'> &
  Omit<TransactionReceiptPending<T>, 'status'>

export type AnyTransactionReceipt<T extends 'SAFE' | 'EOA' = 'SAFE' | 'EOA'> =
  | TransactionReceiptPending<T>
  | TransactionReceipt<T>

export type AnyTransactionReceiptPayload = Omit<AnyTransactionReceipt, 'dateAdded'>
export type TransactionReceiptMap = Record<Hash, AnyTransactionReceipt>

export interface TransactionOptions {
  metadata?: Record<string, unknown>
  metadataBatch?: Record<string, unknown>[]
}
