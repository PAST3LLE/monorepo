import { BigNumber } from '@ethersproject/bignumber'
import { devWarn } from '@past3lle/utils'
import { useEffect } from 'react'
import { Address, useAccount } from 'wagmi'

import { SkillForgeBalances, useSkillForgeBalancesWriteAtom, useSkillForgeResetBalancesAtom } from '..'
import {
  useRefetchOnAddressAndChain,
  useSkillForgeGetSkillsAddresses,
  useSkillForgeSkillsBalanceOfBatch,
  useSupportedChainId
} from '../../../hooks'
import { WithLoadAmount } from '../../../hooks/types'
import { SkillForgeMetadataState, useSkillForgeMetadataReadAtom } from '../../Metadata'

// Default amount of latest collection IDs to pull from CollectionsManager.sol
const DEFAULT_COLLECTION_LOAD_AMOUNT = 3

export function SkillForgeBalancesUpdater({ loadAmount = DEFAULT_COLLECTION_LOAD_AMOUNT }: Partial<WithLoadAmount>) {
  const { address } = useAccount()
  const chainId = useSupportedChainId()

  const [metadata] = useSkillForgeMetadataReadAtom()
  const [, updateSkillForgeBalances] = useSkillForgeBalancesWriteAtom()
  const [, resetUserBalances] = useSkillForgeResetBalancesAtom()

  const { data: skills = [] } = useSkillForgeGetSkillsAddresses({ loadAmount })
  const { data: balancesBatch, refetch: refetchBalances } = useSkillForgeSkillsBalanceOfBatch(
    skills as Address[],
    metadata,
    address,
    chainId
  )

  useRefetchOnAddressAndChain(refetchBalances)

  useEffect(() => {
    if (!chainId) return
    const metadataLoaded = !!metadata?.[0]?.ids?.length

    const derivedData: BigNumber[][] = _getEnvBalances(balancesBatch as BigNumber[][], metadata)

    if (metadataLoaded) {
      if (!address) {
        // if address is undefined, reset balances
        resetUserBalances({})
      } else {
        const balances = reduceBalanceDataToMap(derivedData, skills as Address[], metadata, chainId)

        updateSkillForgeBalances(balances)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, address, balancesBatch, metadata, resetUserBalances, updateSkillForgeBalances])

  return null
}

function reduceBalanceDataToMap(
  data: readonly BigNumber[][],
  collectionsAddresses: Address[],
  metadata: SkillForgeMetadataState['metadata'][number],
  chainId: number
) {
  if (!data) return {}

  return data.reduce((oAcc, bnData, collectionIdx) => {
    const chainBalance = (bnData || []).reduce((acc, nextBn, i) => {
      const collectionAddress = collectionsAddresses?.[collectionIdx]
      const skillId = metadata[collectionIdx].ids[i]
      if (!!collectionAddress) {
        acc[`${collectionAddress}-${skillId}`] = nextBn.toString()
      }

      return acc
    }, {} as SkillForgeBalances[number])
    return { ...oAcc, [chainId]: { ...oAcc[chainId], ...chainBalance } }
  }, {} as SkillForgeBalances)
}

function _getEnvBalances(
  realBalances: BigNumber[][],
  metadata: SkillForgeMetadataState['metadata'][number]
): BigNumber[][] {
  // TODO: remove this
  const SHOW_MOCK_DATA = !!process.env.REACT_APP_MOCK_METADATA
  if (!SHOW_MOCK_DATA) {
    return realBalances
  } else {
    devWarn('[UserBalanceUpdater]::USING MOCK METADATA')
    return metadata.map((collection) => {
      return Array.from({ length: collection?.ids?.length || 0 }).map(() => BigNumber.from(Math.round(Math.random())))
    })
  }
}
