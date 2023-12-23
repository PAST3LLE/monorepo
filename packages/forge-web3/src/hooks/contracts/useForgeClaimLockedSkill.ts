import { Collection__factory, ERC1155__factory, MergeManager__factory } from '@past3lle/skilltree-contracts'
import { Address, MakeOptional } from '@past3lle/types'
import { devDebug, devError } from '@past3lle/utils'
import { useAddPendingTransaction } from '@past3lle/web3-modal'
import { useCallback, useMemo } from 'react'
import { Abi, ContractFunctionConfig } from 'viem'
import {
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useWalletClient
} from 'wagmi'

import { useForgeContractAddressMapReadAtom } from '../../state'
import { SkillMetadata } from '../../types'
import { formatSkillMetadataToArgs, skillToDependencySet } from '../../utils'
import { useSupportedChainId } from '../useForgeSupportedChainId'
import { useForgeContractAddressesByChain } from './useForgeContractAddress'

type WriteContractCallbackParams<A extends Abi | readonly []> = MakeOptional<
  ContractFunctionConfig<A>,
  'address' | 'args'
> & {
  args?: ContractFunctionConfig<A>['args']
}

export function useWriteContractCallback<A extends Abi>() {
  const { address: account } = useAccount()
  const { data: client } = useWalletClient()
  const publicClient = usePublicClient()

  return useCallback(
    async ({ abi, address, functionName, args }: WriteContractCallbackParams<A>) => {
      try {
        if (!client || !publicClient || !functionName || !abi || !address || !functionName)
          throw new Error('Missing dependencies!')
        const { request } = await publicClient.simulateContract({
          account,
          address,
          abi,
          functionName,
          args
        } as any)
        return client.writeContract(request)
      } catch (error: any) {
        devError('[@past3lle/forge-web3::useWriteContractCallback] Error!', error?.message)
        throw error
      }
    },
    [account, client, publicClient]
  )
}

export function useForgeApproveCallback() {
  const mergeManager = useForgeContractAddressesByChain(undefined, false)?.mergeManager
  const addPending = useAddPendingTransaction()
  const approveCallback = useWriteContractCallback()

  return useCallback(
    async (tokenAddress: Address) => {
      return approveCallback({
        abi: Collection__factory.abi,
        address: tokenAddress,
        functionName: 'setApprovalForAll',
        args: mergeManager ? [mergeManager, true] : undefined
      }).then((hash) => {
        addPending(hash)
        return hash
      })
    },
    [addPending, approveCallback, mergeManager]
  )
}

export function useForgeApproveAllBatchCallback() {
  const approveCallback = useForgeApproveCallback()

  return useCallback(
    async (tokenAddresses: Address[]) => Promise.all(tokenAddresses.map(approveCallback)),
    [approveCallback]
  )
}

export function useForgeApproveAllBatch(
  unapprovedList: Address[],
  approveAddress?: Address
): (() => Promise<Address>)[] | null {
  const addPending = useAddPendingTransaction()
  const approveCallback = useWriteContractCallback()
  const approveCallbacksList = useMemo(
    () =>
      !unapprovedList.length
        ? null
        : unapprovedList.map(
            (token) => async () =>
              approveCallback({
                abi: ERC1155__factory.abi,
                functionName: 'setApprovalForAll',
                address: token,
                args: approveAddress ? [approveAddress, true] : undefined
              }).then((tx) => {
                addPending(tx)
                return tx
              })
          ),
    [approveAddress, approveCallback, addPending, unapprovedList]
  )

  return approveCallbacksList
}

function useForgeSkillMetadataToArg(skill: SkillMetadata | null) {
  return useMemo(() => formatSkillMetadataToArgs(skill), [skill])
}

export function useForgeGetAllUnapprovedTokens(skill: SkillMetadata | null) {
  const { address } = useAccount()
  const mergeManager = useForgeContractAddressesByChain(undefined, false)?.mergeManager

  const claimingSkillIdentifier = useForgeSkillMetadataToArg(skill)
  // Dedup dependencies list via a set (erc1155 approves all ids in a single token contract)
  const dedupedAddressList = useMemo(
    () =>
      !claimingSkillIdentifier ? [] : [...(skillToDependencySet(skill)?.add(claimingSkillIdentifier.token) || [])],
    [claimingSkillIdentifier, skill]
  )

  const { data } = useContractReads({
    enabled: Boolean(address && mergeManager && claimingSkillIdentifier),
    contracts: useMemo(() => {
      if (!dedupedAddressList.length) return undefined

      return dedupedAddressList.map((dep) => ({
        abi: Collection__factory.abi,
        address: dep,
        functionName: 'isApprovedForAll',
        args: address && mergeManager ? [address, mergeManager] : undefined
      }))
    }, [address, mergeManager, dedupedAddressList])
  })

  const unapprovedList = useMemo(
    () => getBatchTransactionsIsApproved(data, dedupedAddressList),
    [data, dedupedAddressList]
  )

  return unapprovedList
}

export function useForgeApproveAllDeps(skill: SkillMetadata | null) {
  const mergeManager = useForgeContractAddressesByChain(undefined, false)?.mergeManager
  const unapprovedList = useForgeGetAllUnapprovedTokens(skill)

  return useForgeApproveAllBatch(unapprovedList, mergeManager)
}

export function useForgeClaimLockedSkill(skill: SkillMetadata | null) {
  const mergeManager = useForgeContractAddressesByChain(undefined, false)?.mergeManager
  const arg = useForgeSkillMetadataToArg(skill)
  const unapprovedList = useForgeGetAllUnapprovedTokens(skill)
  const addPending = useAddPendingTransaction()

  const { config, error } = usePrepareContractWrite({
    // enabled if unapproved list is empty (all approved)
    enabled: !unapprovedList.length,
    address: mergeManager,
    abi: MergeManager__factory.abi,
    functionName: 'claimLockedSkill',
    args: !!arg ? [arg] : undefined
  })

  if (error) {
    devError('useForgeClaimLockedSkill prepare contract for write error!', error)
  }
  const res = useContractWrite(config)
  return {
    ...res,
    writeAsync: async () => {
      return res?.writeAsync?.().then((res) => {
        addPending(res.hash)
        return res
      })
    }
  }
}

export function useForgeClaimLockedSkillCallback() {
  const mergeManager = useForgeContractAddressesByChain(undefined, false)?.mergeManager
  const addPending = useAddPendingTransaction()

  const claimLockedSkill = useWriteContractCallback()

  return useCallback(
    async (skill: SkillMetadata | null) => {
      return claimLockedSkill({
        address: mergeManager,
        abi: MergeManager__factory.abi,
        functionName: 'claimLockedSkill',
        args: skill ? [formatSkillMetadataToArgs(skill)] : undefined
      }).then((hash) => {
        addPending(hash)
        return hash
      })
    },
    [addPending, claimLockedSkill, mergeManager]
  )
}

export function useForgeUnpreparedClaimLockedSkill(args: { token: Address; id: bigint }) {
  const chainId = useSupportedChainId()
  const [contractAddresses] = useForgeContractAddressMapReadAtom()

  const mergeManager = chainId ? contractAddresses[chainId]?.collectionsManager : undefined

  const config = {
    mode: undefined,
    address: mergeManager,
    abi: MergeManager__factory.abi,
    functionName: 'claimLockedSkill',
    args: [args]
  } as const

  return useContractWrite(config)
}

interface ClaimLockedSkillOpts {
  onApproveSend: (hash?: Address) => void
  onClaimSend: (hash?: Address) => void
}
export function useForgeApproveAndClaimLockedSkillCallback(
  skill: SkillMetadata | null,
  opts?: ClaimLockedSkillOpts
): [Omit<ReturnType<typeof useForgeClaimLockedSkill>, 'writeAsync'>, () => Promise<void | undefined>] {
  const approveAllTokensCallbacks = useForgeApproveAllDeps(skill)
  const { writeAsync: claimLockedSkill, ...claimLockedSkillApi } = useForgeClaimLockedSkill(skill)
  // const pendingTransactions = usePendingTransactions()

  return [
    claimLockedSkillApi,
    useCallback(async () => {
      devDebug(`
  [useForgeApproveAndClaimLockedSkillCallback] --> STATE!

    Needs approval?     ${!!approveAllTokensCallbacks}
    --
    Has claim callback? ${!!claimLockedSkill}
`)
      try {
        // Step 1: check & approve merge manager to burn / claiming tokens
        if (!!approveAllTokensCallbacks) {
          // fire all approve callbacks
          approveAllTokensCallbacks.map((callback) => callback().then((res) => opts?.onApproveSend(res)))
        }

        // Step 2:
        return claimLockedSkill?.().then((res) => opts?.onClaimSend(res?.hash))
      } catch (error) {
        devError('[@past3lle/forge-web3] --> useForgeApproveAndClaimLockedSkillCallback --> Error!', error)
        throw error
      }
    }, [approveAllTokensCallbacks, claimLockedSkill, opts])
  ]
}

function getBatchTransactionsIsApproved(
  data:
    | (
        | {
            error: Error
            result?: undefined
            status: 'failure'
          }
        | {
            error?: undefined
            result: unknown
            status: 'success'
          }
      )[]
    | undefined,
  dedupedAddressList?: Address[]
): Address[] {
  if (!data?.length) return []

  const sameLengths = data.length === dedupedAddressList?.length
  if (!sameLengths) throw new Error('Mismatch array lengths: getBatchTransactionsIsApproved')

  const unapprovedList = dedupedAddressList.filter((_, i) => !Boolean(data[i].result))
  return unapprovedList
}
