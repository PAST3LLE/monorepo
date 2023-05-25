import { BigNumber } from '@ethersproject/bignumber'
import { devWarn } from '@past3lle/utils'
import { useEffect } from 'react'
import { Address, useAccount } from 'wagmi'

import { SkillForgeBalances, useSkillForgeBalancesAtom, useSkillForgeResetBalancesAtom } from '..'
import { useRefetchOnAddress, useSkillForgeGetSkillsAddresses, useSkillForgeSkillsBalanceOfBatch } from '../../../hooks'
import { getSkillId } from '../../../utils'
import { SkillForgeMetadataState, useSkillForgeMetadataReadAtom } from '../../Metadata'
import { SkillForgeMetadataUpdaterProps } from '../../Metadata/updaters/MetadataUpdater'

// Default amount of latest collection IDs to pull from CollectionsManager.sol
const DEFAULT_COLLECTION_LOAD_AMOUNT = 3

type SkillForgeBalancesProps = Omit<SkillForgeMetadataUpdaterProps, 'metadataUriMap'>
export function SkillForgeBalancesUpdater({
  contractAddressMap,
  idBase,
  loadAmount = DEFAULT_COLLECTION_LOAD_AMOUNT
}: SkillForgeBalancesProps) {
  const [metadata] = useSkillForgeMetadataReadAtom()
  const [, updateSkillForgeBalances] = useSkillForgeBalancesAtom()
  const [, resetUserBalances] = useSkillForgeResetBalancesAtom()

  const { address } = useAccount()

  const { data: skills = [] } = useSkillForgeGetSkillsAddresses({ loadAmount, contractAddressMap })
  const { data: balancesBatch, refetch: refetchBalances } = useSkillForgeSkillsBalanceOfBatch(
    skills as Address[],
    metadata,
    address,
    idBase
  )

  useRefetchOnAddress(refetchBalances)

  useEffect(() => {
    const metadataLoaded = !!metadata?.[0]?.size

    const derivedData: BigNumber[][] = _getEnvBalances(balancesBatch as BigNumber[][], metadata)

    if (metadataLoaded) {
      if (!address) {
        // if address is undefined, reset balances
        resetUserBalances({})
      } else {
        const balances = reduceBalanceDataToMap(derivedData, skills as Address[], address, idBase)

        updateSkillForgeBalances((state) => ({
          balances: {
            ...state.balances,
            ...balances
          }
        }))
      }
    }
  }, [address, balancesBatch, metadata, updateSkillForgeBalances])

  return null
}

function reduceBalanceDataToMap(
  data: readonly BigNumber[][],
  skills: Address[],
  userAddress?: Address,
  idBase?: number
) {
  if (!data) return {}

  return data.reduce((oAcc, bnData, collIdx) => {
    const obj = (bnData || []).reduce((acc, nextBn, idx) => {
      const id = skills?.[collIdx]
      if (!!id) {
        // return "0" if userAddress is undefined, else return real balance
        acc[`${id}-${getSkillId(idx, idBase)}`] = userAddress ? nextBn.toString() : '0'
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
      return Array.from({ length: collection.size }).map(() => BigNumber.from(Math.round(Math.random())))
    })
  }
}
