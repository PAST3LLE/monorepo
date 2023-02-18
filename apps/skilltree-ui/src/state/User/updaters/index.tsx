import { UserBalances, useUserAtom } from '..'
import { PSTLCollectionBaseSkills__factory } from '@past3lle/skilltree-contracts'
import { getSkillId } from 'components/Skills/utils'
import { MOCK_COLLECTION_ERROR_OFFSET } from 'constants/skills'
import { BigNumber } from 'ethers'
import { useEffect } from 'react'
import { MetadataState, useMetadataReadAtom } from 'state/Metadata'
import { Address, useAccount, useContractReads } from 'wagmi'
import { SKILLS_GOERLI, SKILLS_MUMBAI } from 'web3/constants/addresses'
import { useContractAddressesByChain } from 'web3/hooks/useContractAddress'

function gatherSkillContractConfigParams(
  skillsAddressList: typeof SKILLS_GOERLI | typeof SKILLS_MUMBAI,
  metadata: MetadataState['metadata'],
  balanceOfAddress: Address
) {
  // TODO: remove offset
  const contractConfigList = skillsAddressList.slice(MOCK_COLLECTION_ERROR_OFFSET).flatMap(({ address }, i) => {
    if (!address) {
      console.warn(
        '[UserBalancesUpdater::gatherSkillContractConfigParams]::Address undefined! Check contracts map in constants.'
      )
      return undefined
    }

    const args = getBalanceOfBatchArgs(metadata[i]?.size || 0, balanceOfAddress)
    return {
      abi: PSTLCollectionBaseSkills__factory.abi,
      address,
      functionName: 'balanceOfBatch',
      args
    }
  })

  return contractConfigList
}

export function UserBalancesUpdater() {
  const [metadata] = useMetadataReadAtom()
  const [, updateUserBalances] = useUserAtom()

  const { address = '0x0' } = useAccount()

  const { skills } = useContractAddressesByChain()
  const configList = gatherSkillContractConfigParams(skills, metadata, address)
  const { data } = useContractReads({
    contracts: configList,
    watch: true
  })

  useEffect(() => {
    const metadataLoaded = !!metadata?.[0]?.size

    const derivedData: BigNumber[][] = _getEnvBalances(data as BigNumber[][], metadata)

    if (metadataLoaded) {
      const balances = reduceBalanceDataToMap(derivedData)
      // TODO: fix with real balances
      updateUserBalances((state) => ({
        balances: {
          ...state.balances,
          ...balances
        }
      }))
    }
  }, [data, metadata, updateUserBalances])

  return null
}

function getBalanceOfBatchArgs(size: number, address: Address) {
  return Array.from({ length: size }).reduce(
    (acc: [Address[], BigNumber[]], _, idx) => {
      acc[0] = [...acc[0], address]
      acc[1] = [...acc[1], BigNumber.from(getSkillId(idx))]
      return acc
    },
    [[], []] as [Address[], BigNumber[]]
  )
}

function reduceBalanceDataToMap(data: readonly BigNumber[][]) {
  if (!data) return {}

  return data.reduce((oAcc, bnData, collIdx) => {
    const obj = (bnData || []).reduce((acc, nextBn, idx) => {
      acc[`${collIdx + 1}-${getSkillId(idx)}`] = nextBn.toString()

      return acc
    }, {} as UserBalances)
    return { ...oAcc, ...obj }
  }, {} as UserBalances)
}

function _getEnvBalances(realBalances: BigNumber[][], metadata: MetadataState['metadata']): BigNumber[][] {
  // TODO: remove this
  const SHOW_MOCK_DATA: boolean = JSON.parse(localStorage.getItem('PSTL_SHOW_MOCK_DATA') || 'false')
  if (!SHOW_MOCK_DATA) {
    return realBalances
  } else {
    return metadata.map((collection) => {
      return Array.from({ length: collection.size }).map(() => BigNumber.from(Math.round(Math.random())))
    })
  }
}
