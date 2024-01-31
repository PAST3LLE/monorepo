import { devError } from '@past3lle/utils'
import { useCallback, useMemo } from 'react'
import { Abi, Address, ContractFunctionArgs, PublicClient, SimulateContractParameters, WalletClient } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

import { SkillMetadata } from '../../types'
import { dedupeList, formatSkillMetadataToArgs } from '../../utils'

export type WriteContractCallbackParams<A extends Abi | readonly []> = ContractFunctionArgs<A>
type PrepareContractReturnType = {
  account: Address | undefined
  client: WalletClient | undefined
  publicClient: PublicClient | undefined
}
export function usePrepareContract(): PrepareContractReturnType {
  const { address: account } = useAccount()
  const { data: client } = useWalletClient()
  const publicClient = usePublicClient()

  return { account, client, publicClient }
}

export function useContractReadCallback() {
  const { publicClient } = usePrepareContract()

  return useCallback(
    async (args: SimulateContractParameters) => {
      try {
        if (!publicClient) throw new Error('Missing public client!')
        return publicClient.simulateContract(args)
      } catch (error: any) {
        devError('[@past3lle/forge-web3::useContractCallback] Error!', error?.message)
        throw error
      }
    },
    [publicClient]
  )
}

export function useForgeSkillMetadataToArg(skill: SkillMetadata | null) {
  return useMemo(() => formatSkillMetadataToArgs(skill), [skill])
}

export function useDedupeList<A extends unknown[]>(list: A): A {
  return useMemo(() => dedupeList(list), [list])
}
