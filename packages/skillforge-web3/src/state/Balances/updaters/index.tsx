import { BigNumber } from '@ethersproject/bignumber'
import { devWarn } from '@past3lle/utils'
import { useEffect } from 'react'
import { Address, useAccount } from 'wagmi'

import { SkillForgeBalances, useSkillForgeBalancesAtom, useSkillForgeResetBalancesAtom } from '..'
import { useRefetchOnAddress, useSkillForgeGetSkillsAddresses, useSkillForgeSkillsBalanceOfBatch } from '../../../hooks'
import { WithLoadAmount } from '../../../hooks/types'
import { SkillForgeMetadataState, useSkillForgeMetadataReadAtom } from '../../Metadata'

// Default amount of latest collection IDs to pull from CollectionsManager.sol
const DEFAULT_COLLECTION_LOAD_AMOUNT = 3

export function SkillForgeBalancesUpdater({ loadAmount = DEFAULT_COLLECTION_LOAD_AMOUNT }: Partial<WithLoadAmount>) {
  const [metadata] = useSkillForgeMetadataReadAtom()
  const [, updateSkillForgeBalances] = useSkillForgeBalancesAtom()
  const [, resetUserBalances] = useSkillForgeResetBalancesAtom()

  const { address } = useAccount()

  const { data: skills = [] } = useSkillForgeGetSkillsAddresses({ loadAmount })
  const { data: balancesBatch, refetch: refetchBalances } = useSkillForgeSkillsBalanceOfBatch(
    skills as Address[],
    metadata,
    address
  )

  useRefetchOnAddress(refetchBalances)

  useEffect(() => {
    const metadataLoaded = !!metadata?.[0]?.ids?.length

    const derivedData: BigNumber[][] = _getEnvBalances(balancesBatch as BigNumber[][], metadata)

    if (metadataLoaded) {
      if (!address) {
        // if address is undefined, reset balances
        resetUserBalances({})
      } else {
        const balances = reduceBalanceDataToMap(derivedData, skills as Address[], metadata, address)

        updateSkillForgeBalances((state) => ({
          balances: {
            ...state.balances,
            ...balances
          }
        }))
      }
    }
  }, [address, balancesBatch, metadata, resetUserBalances, skills, updateSkillForgeBalances])

  return null
}

function reduceBalanceDataToMap(
  data: readonly BigNumber[][],
  collectionsAddresses: Address[],
  metadata: SkillForgeMetadataState['metadata'],
  userAddress?: Address
) {
  if (!data) return {}

  return data.reduce((oAcc, bnData, collectionIdx) => {
    const obj = (bnData || []).reduce((acc, nextBn, i) => {
      const collectionAddress = collectionsAddresses?.[collectionIdx]
      const skillId = metadata[collectionIdx].ids[i]
      if (!!collectionAddress) {
        // return "0" if userAddress is undefined, else return real balance
        acc[`${collectionAddress}-${skillId}`] = userAddress ? nextBn.toString() : '0'
      }

      return acc
    }, {} as SkillForgeBalances)
    return { ...oAcc, ...obj }
  }, {} as SkillForgeBalances)
}

function _getEnvBalances(realBalances: BigNumber[][], metadata: SkillForgeMetadataState['metadata']): BigNumber[][] {
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
