import { UserBalances, useUserAtom } from '..'
import { getSkillId } from 'components/Skills/utils'
import { BigNumber } from 'ethers'
import { useEffect } from 'react'
import { useMetadataReadAtom } from 'state/Metadata'
import { Address, useAccount, useContractRead } from 'wagmi'
import { usePrepareSkillsContract } from 'web3/hooks/skills/usePrepareSkillsContract'

export function UserBalancesUpdater() {
  const [metadata] = useMetadataReadAtom()
  const [, updateUserBalances] = useUserAtom()

  const { address = '0x0' } = useAccount()

  const skillConfig2 = usePrepareSkillsContract(2)
  const skillConfig3 = usePrepareSkillsContract(3)

  // TODO: ideally collections sizes should be saved to state early and cached
  const collection2SkillArgs = getBalanceOfBatchArgs(6, address)
  const collection3SkillArgs = getBalanceOfBatchArgs(2, address)

  // TODO: ideally these skills addresses would be written to networks.json in @past3lle/skilltree-contracts
  const { data: balances2 } = useContractRead({
    ...skillConfig2,
    functionName: 'balanceOfBatch',
    args: collection2SkillArgs,
    select(data) {
      return reduceBalanceDataToMap(data, 1)
    }
  })
  const { data: balances3 } = useContractRead({
    ...skillConfig3,
    functionName: 'balanceOfBatch',
    args: collection3SkillArgs,
    select(data) {
      return reduceBalanceDataToMap(data, 2)
    }
  })

  useEffect(() => {
    const metadataLoaded = !!metadata[0].length

    if (metadataLoaded) {
      // TODO: fix with real balances
      updateUserBalances((state) => ({
        balances: {
          ...state.balances,
          ...balances2,
          ...balances3
        }
      }))
    }
  }, [metadata, balances2, balances3, updateUserBalances])

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

function reduceBalanceDataToMap(data: readonly BigNumber[], collectionId: number) {
  return data.reduce((acc, nextBn, idx) => {
    acc[`${collectionId}-${getSkillId(idx)}`] = nextBn.toString()

    return acc
  }, {} as UserBalances)
}
