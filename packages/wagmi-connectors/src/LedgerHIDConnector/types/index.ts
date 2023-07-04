import { BigNumberish } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/providers'
import { UnsignedTransaction } from '@ethersproject/transactions'
import { Address } from 'viem'

export type UnsignedTransactionStrict = Omit<UnsignedTransaction, 'type'> & {
  type?: number
}

export type TransactionRequestExtended = TransactionRequest & {
  gas?: BigNumberish
}

export type ConnectorUpdate<P> = { provider: P; account: string | Address }
