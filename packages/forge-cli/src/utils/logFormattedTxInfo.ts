import { ContractTransaction } from 'ethers'

export function logFormattedTxInfo(txInfo: ContractTransaction) {
  console.debug(`
Transaction info:

Transaction hash: ${txInfo?.hash}
Block number: ${txInfo?.blockNumber}
Nonce: ${txInfo?.nonce}
`)
}
