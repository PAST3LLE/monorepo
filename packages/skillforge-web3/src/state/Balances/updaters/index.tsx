import { BigNumber } from '@ethersproject/bignumber'
import { PSTLCollectionBaseSkills__factory } from '@past3lle/skilltree-contracts'
import { devWarn } from '@past3lle/utils'
import { useEffect } from 'react'
import { Address, useAccount, useContractReads } from 'wagmi'

import { SkillForgeBalances, useSkillForgeBalancesAtom } from '..'
import { MOCK_COLLECTION_ERROR_OFFSET } from '../../../constants/temp-to-remove'
import { useSkillForgeContractAddressesByChain } from '../../../hooks'
import { SkillForgeContractAddressMap } from '../../../types'
import { getSkillId } from '../../../utils'
import { SkillForgeMetadataState, useSkillForgeMetadataReadAtom } from '../../Metadata'
import { SkillForgeMetadataUpdaterProps } from '../../Metadata/updaters/MetadataUpdater'

function gatherSkillContractConfigParams(
  skillsAddressList: SkillForgeContractAddressMap[0]['skills'],
  metadata: SkillForgeMetadataState['metadata'],
  balanceOfAddress: Address,
  idBase?: number
) {
  // TODO: remove offset
  const contractConfigList = skillsAddressList.slice(MOCK_COLLECTION_ERROR_OFFSET).flatMap(({ address }, i) => {
    if (!address) {
      devWarn(
        '[SkillForgeBalancesUpdater::gatherSkillContractConfigParams]::Address undefined! Check contracts map in constants.'
      )
      return undefined
    }

    const args = getBalanceOfBatchArgs(metadata[i]?.size || 0, balanceOfAddress, idBase)
    return {
      abi: PSTLCollectionBaseSkills__factory.abi,
      address,
      functionName: 'balanceOfBatch',
      args
    }
  })

  return contractConfigList
}

type SkillForgeBalancesProps = Omit<SkillForgeMetadataUpdaterProps, 'metadataUriMap'>
export function SkillForgeBalancesUpdater({ contractAddressMap, idBase }: SkillForgeBalancesProps) {
  const [metadata] = useSkillForgeMetadataReadAtom()
  const [, updateSkillForgeBalances] = useSkillForgeBalancesAtom()

  const { address = '0x0' } = useAccount()

  const { skills } = useSkillForgeContractAddressesByChain(contractAddressMap)
  const configList = gatherSkillContractConfigParams(skills, metadata, address, idBase)
  const { data } = useContractReads({
    contracts: configList,
    watch: true
  })

  useEffect(() => {
    const metadataLoaded = !!metadata?.[0]?.size

    const derivedData: BigNumber[][] = _getEnvBalances(data as BigNumber[][], metadata)

    if (metadataLoaded) {
      const balances = reduceBalanceDataToMap(derivedData, idBase)
      // TODO: fix with real balances
      updateSkillForgeBalances((state) => ({
        balances: {
          ...state.balances,
          ...balances
        }
      }))
    }
  }, [data, metadata, updateSkillForgeBalances])

  return null
}

function getBalanceOfBatchArgs(size: number, address: Address, idBase?: number) {
  return Array.from({ length: size }).reduce(
    (acc: [Address[], BigNumber[]], _, idx) => {
      acc[0] = [...acc[0], address]
      acc[1] = [...acc[1], BigNumber.from(getSkillId(idx, idBase))]
      return acc
    },
    [[], []] as [Address[], BigNumber[]]
  )
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
