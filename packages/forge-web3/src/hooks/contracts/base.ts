import { MakeOptional } from '@past3lle/types'
import { devError } from '@past3lle/utils'
import { useCallback, useMemo } from 'react'
import { Abi, ContractFunctionConfig } from 'viem'
import { PublicClient, useAccount, usePublicClient, useWalletClient } from 'wagmi'

import { SkillMetadata } from '../../types'
import { dedupeList, formatSkillMetadataToArgs } from '../../utils'

export type WriteContractCallbackParams<A extends Abi | readonly []> = MakeOptional<
  ContractFunctionConfig<A>,
  'address' | 'args'
>

export function usePrepareContract() {
  const { address: account } = useAccount()
  const { data: client } = useWalletClient()
  const publicClient = usePublicClient()

  return { account, client, publicClient }
}

export function useContractReadCallback() {
  const { account, client, publicClient } = usePrepareContract()

  return useCallback(
    async <A extends Abi>({ abi, address, functionName, args }: WriteContractCallbackParams<A>) => {
      try {
        if (!client || !publicClient || !functionName || !abi || !address || !args)
          throw new Error('Missing dependencies!')
        const response = await publicClient.simulateContract({
          account,
          address,
          abi,
          functionName,
          args
        } as Parameters<PublicClient['simulateContract']>[0])
        return response
      } catch (error: any) {
        devError('[@past3lle/forge-web3::useContractCallback] Error!', error?.message)
        throw error
      }
    },
    [account, client, publicClient]
  )
}

export function useContractWriteCallback() {
  const { data: client } = useWalletClient()
  const readContract = useContractReadCallback()

  return useCallback(
    async <A extends Abi | readonly []>(params: WriteContractCallbackParams<A>) => {
      try {
        const { abi, address, functionName, args } = params
        if (!client || !functionName || !abi || !address || !functionName || !args)
          throw new Error('Missing dependencies!')
        const response = await readContract(params)
        return client.writeContract(response.request)
      } catch (error: any) {
        devError('[@past3lle/forge-web3::useContractCallback] Error!', error?.message)
        throw error
      }
    },
    [client, readContract]
  )
}

export function useForgeSkillMetadataToArg(skill: SkillMetadata | null) {
  return useMemo(() => formatSkillMetadataToArgs(skill), [skill])
}

export function useDedupeList<A extends unknown[]>(list: A): A {
  return useMemo(() => dedupeList(list), [list])
}
