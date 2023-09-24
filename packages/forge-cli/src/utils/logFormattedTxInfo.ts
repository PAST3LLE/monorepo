import { TransactionResponse } from '@ethersproject/providers'

export function logFormattedTxInfo(txInfo: TransactionResponse) {
  console.debug(`
Transaction info:

Transaction hash: ${txInfo?.hash}
Block number: ${txInfo?.blockNumber}
Nonce: ${txInfo?.nonce}
`)
}
