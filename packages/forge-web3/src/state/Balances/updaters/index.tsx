import { useEffect } from 'react'
import { Address, useAccount } from 'wagmi'

import { ForgeBalances, useForgeBalancesWriteAtom, useForgeResetBalancesAtom } from '..'
import {
  useForgeGetSkillsAddresses,
  useForgeSkillsBalanceOfBatch,
  useRefetchOnAddressAndChain,
  useSupportedOrDefaultChainId
} from '../../../hooks'
import { WithLoadAmount } from '../../../hooks/types'
import { ForgeMetadataState, useForgeMetadataReadAtom } from '../../Metadata'

// Default amount of latest collection IDs to pull from CollectionsManager.sol
const DEFAULT_COLLECTION_LOAD_AMOUNT = 3

export function ForgeBalancesUpdater({ loadAmount = BigInt(DEFAULT_COLLECTION_LOAD_AMOUNT) }: Partial<WithLoadAmount>) {
  const { address } = useAccount()
  const chainId = useSupportedOrDefaultChainId()

  const [metadata] = useForgeMetadataReadAtom(chainId)
  const [, updateForgeBalances] = useForgeBalancesWriteAtom()
  const [, resetUserBalances] = useForgeResetBalancesAtom()

  const { data: skills = [] } = useForgeGetSkillsAddresses({ loadAmount })
  const { data: balancesBatch, refetch: refetchBalances } = useForgeSkillsBalanceOfBatch(
    skills as { result?: Address }[],
    metadata,
    address,
    chainId
  )

  useRefetchOnAddressAndChain(refetchBalances)

  useEffect(() => {
    if (!chainId) return
    const metadataLoaded = !!metadata?.length

    const derivedData: bigint[][] = _getEnvBalances(balancesBatch as { result: bigint[] }[] | undefined)
    const dataHasLength = derivedData?.[0]?.length && derivedData?.[1]?.length

    if (metadataLoaded && dataHasLength) {
      if (!address) {
        // if address is undefined, reset balances
        resetUserBalances({})
      } else {
        const balances = reduceBalanceDataToMap(derivedData, skills as { result: Address }[], metadata, chainId)

        updateForgeBalances(balances)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, address, balancesBatch, metadata, resetUserBalances, updateForgeBalances])

  return null
}

function reduceBalanceDataToMap(
  data: readonly bigint[][],
  collectionsAddresses: { result: Address }[],
  metadata: ForgeMetadataState['metadata'][number],
  chainId: number
) {
  return data.reduce((oAcc, collectionBnBalances, collectionIdx) => {
    const chainBalance = (collectionBnBalances || []).reduce((acc, nextBn, i) => {
      const collectionAddress = collectionsAddresses?.[collectionIdx]?.result

      const skillId = metadata[collectionIdx][i].properties.id

      if (!!collectionAddress) {
        acc[skillId] = nextBn.toString()
      }

      return acc
    }, {} as ForgeBalances[number])
    return { ...oAcc, [chainId]: { ...oAcc[chainId], ...chainBalance } }
  }, {} as ForgeBalances)
}

function _getEnvBalances(realBalances?: { result: bigint[] }[]): bigint[][] {
  return (realBalances || []).map((res) => res.result)
}
