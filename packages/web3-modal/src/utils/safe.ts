import SafeApiKit from '@safe-global/api-kit'
import { Address, Hash, ReplacementReason } from 'viem'

import { AuxSafeTransaction } from '../controllers/TransactionsCtrl/types'
import { SimpleTxInfo } from '../hooks'

const SAFE_TRANSACTION_SERVICE_CACHE: Partial<Record<number, SafeApiKit | null>> = {}

export function getClient(chainId: number): SafeApiKit | null {
  const cachedClient = SAFE_TRANSACTION_SERVICE_CACHE[chainId]

  if (cachedClient !== undefined) {
    return cachedClient
  }

  const client = new SafeApiKit({
    chainId: BigInt(chainId)
  })

  // Add client to cache (or null if unknown network)
  SAFE_TRANSACTION_SERVICE_CACHE[chainId] = client

  return client
}

export function getSafeKitOrThrow(chainId: number): SafeApiKit {
  const client = getClient(chainId)
  if (!client) {
    throw new Error('[@past3lle/web30modal ]Unsupported network for Safe Transaction Service: ' + chainId)
  }

  return client
}

export async function checkSafeTxConfirmedOrReplaced(
  safeKit: SafeApiKit,
  hashes: Hash[],
  address: Address
): Promise<SimpleTxInfo[]> {
  const txInfoAtHash = await Promise.all(hashes.map((hash) => safeKit.getTransaction(hash)))
  const allTxs = (await safeKit.getMultisigTransactions(address))?.results

  const auxTransactions: AuxSafeTransaction[] = txInfoAtHash.map((res) => {
    const transactionsAtNonce = allTxs.filter((tx) => tx.nonce === res.nonce)
    let status: ReplacementReason | undefined
    transactionsAtNonce.forEach((tx) => {
      if (!!tx.isSuccessful && res.transactionHash !== tx.transactionHash) {
        if (tx.value === '0') status = 'cancelled'
        else if (tx.value === res.value) status = 'repriced'
        else status = 'replaced'
      }
    })

    return { ...res, replacedReason: status }
  })

  return auxTransactions.map(_getTxInfoFromSafeTx)
}

/**
 * getSafeKitAndCheckConfirmations
 * @param chainId - number
 * @param hash - `0x${string}`
 * @returns [confirmed: boolean, confirmedTxHash: `0x${string}`, replacementHashes: `0x${string}`[], nonce: number]
 */
export async function getSafeKitAndTx(chainId: number, hashes: Hash[], safeAddress: Address) {
  const safeKit = getSafeKitOrThrow(chainId)
  return checkSafeTxConfirmedOrReplaced(safeKit, hashes, safeAddress)
}

function _getTxInfoFromSafeTx(safeTx: AuxSafeTransaction): SimpleTxInfo {
  return {
    transactionHash: safeTx?.transactionHash as Hash | undefined,
    safeTxHash: safeTx.safeTxHash as Hash,
    nonce: safeTx.nonce,
    safeTxInfo: {
      replacedReason: safeTx?.replacedReason,
      confirmationsRequired: safeTx?.replacedReason ? 0 : safeTx.confirmationsRequired,
      confirmations: safeTx?.replacedReason ? undefined : safeTx.confirmations
    }
  }
}
