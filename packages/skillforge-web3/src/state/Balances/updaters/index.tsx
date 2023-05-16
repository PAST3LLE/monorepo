import { BigNumber } from '@ethersproject/bignumber'
import { devWarn } from '@past3lle/utils'
import { useEffect } from 'react'
import { Address, useAccount } from 'wagmi'

import { SkillForgeBalances, useSkillForgeBalancesAtom } from '..'
import { useSkillForgeGetSkillsAddresses, useSkillForgeSkillsBalanceOfBatch } from '../../../hooks'
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

  const { address = '0x0' } = useAccount()

  const { data: skills = [] } = useSkillForgeGetSkillsAddresses({ loadAmount, contractAddressMap })
  const { data: balancesBatch } = useSkillForgeSkillsBalanceOfBatch(skills as Address[], metadata, address, idBase)

  useEffect(() => {
    const metadataLoaded = !!metadata?.[0]?.size

    const derivedData: BigNumber[][] = _getEnvBalances(balancesBatch as BigNumber[][], metadata)

    if (metadataLoaded) {
      const balances = reduceBalanceDataToMap(derivedData, idBase)

      updateSkillForgeBalances((state) => ({
        balances: {
          ...state.balances,
          ...balances
        }
      }))
    }
  }, [balancesBatch, metadata, updateSkillForgeBalances])

  return null
}

function reduceBalanceDataToMap(data: readonly BigNumber[][], idBase?: number) {
  if (!data) return {}

  return data.reduce((oAcc, bnData, collIdx) => {
    const obj = (bnData || []).reduce((acc, nextBn, idx) => {
      acc[`${collIdx + 1}-${getSkillId(idx, idBase)}`] = nextBn.toString()

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
