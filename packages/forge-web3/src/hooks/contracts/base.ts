import { devError } from '@past3lle/utils'
import { useCallback, useMemo } from 'react'
import { Abi, ContractFunctionArgs, SimulateContractParameters } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

import { SkillMetadata } from '../../types'
import { dedupeList, formatSkillMetadataToArgs } from '../../utils'

export type WriteContractCallbackParams<A extends Abi | readonly []> = ContractFunctionArgs<A>

export function usePrepareContract() {
  const { address: account } = useAccount()
  const { data: client } = useWalletClient()
  const publicClient = usePublicClient()

  return { account, client, publicClient }
}

export function useContractReadCallback() {
  const { account, client, publicClient } = usePrepareContract()

  return useCallback(
    async (args: SimulateContractParameters) => {
      try {
        return publicClient.simulateContract(args)
      } catch (error: any) {
        devError('[@past3lle/forge-web3::useContractCallback] Error!', error?.message)
        throw error
      }
    },
    [account, client, publicClient]
  )
}

export function useForgeSkillMetadataToArg(skill: SkillMetadata | null) {
  return useMemo(() => formatSkillMetadataToArgs(skill), [skill])
}

export function useDedupeList<A extends unknown[]>(list: A): A {
  return useMemo(() => dedupeList(list), [list])
}
