import { SafeMultisigTransactionListResponse } from '@safe-global/api-kit'
import { Hash, ReplacementReason, TransactionReceipt as TransactionReceiptViem } from 'viem'

export interface TransactionReceiptPending<T extends 'SAFE' | 'EOA' = 'SAFE' | 'EOA'> {
  nonce: number
  status: 'success' | 'reverted' | 'pending' | 'replaced-pending' | 'replaced-success'
  chainId: number
  walletType: T
  safeTxHash: T extends 'SAFE' ? Hash : void
  transactionHash: T extends 'SAFE' ? Hash | undefined : Hash
  replacementTransactionHashes?: Hash[]
}

export type TransactionReceipt<T extends 'SAFE' | 'EOA' = 'SAFE' | 'EOA'> = Omit<TransactionReceiptViem, 'status'> &
  Omit<TransactionReceiptPending<T>, 'status'>

export type AnyTransactionReceipt<T extends 'SAFE' | 'EOA' = 'SAFE' | 'EOA'> = (
  | TransactionReceiptPending<T>
  | TransactionReceipt<T>
) & {
  chainId?: number
  status: TransactionReceiptPending<T>['status']
  replaceReason?: ReplacementReason
  // ms (Date.now())
  dateAdded: number
  safeTxInfo?: T extends 'SAFE' ? Pick<SafeMultisigTransactionListResponse['results'][number], 'confirmations' | 'confirmationsRequired'> : void
}

export type AnyTransactionReceiptPayload = Omit<AnyTransactionReceipt, 'dateAdded'>
export type TransactionReceiptMap = Record<Hash, AnyTransactionReceipt>
