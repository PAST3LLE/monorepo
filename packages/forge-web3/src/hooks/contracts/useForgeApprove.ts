import { Collection__factory, ERC1155__factory } from '@past3lle/skilltree-contracts'
import { devError } from '@past3lle/utils'
import { useAddPendingTransaction } from '@past3lle/web3-modal'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { Address, Hash } from 'viem'
import { useAccount, useReadContracts, useWriteContract } from 'wagmi'

import { useForgeFlattenedSkillDependencies } from '../../state'
import { SkillId, SkillMetadata } from '../../types'
import { skillToDependencySet } from '../../utils'
import { MutationConfig } from '../types'
import { useContractReadCallback, useDedupeList, useForgeSkillMetadataToArg } from './base'
import { useForgeContractAddressesByChain } from './useForgeContractAddress'

/**
 * @name useForgeCheckClaimableSkillDependencyApprovalStatuses
 * @param skill {@link SkillMetadata} - claiming skill metadata info
 * @returns
 */
function useForgeCheckClaimableSkillDependencyApprovalStatuses(skill: SkillMetadata | null): {
  token: `0x${string}`
  approved: boolean
}[] {
  const { address } = useAccount()
  const mergeManager = useForgeContractAddressesByChain(undefined, false)?.mergeManager

  const tokenIdMap = useForgeSkillMetadataToArg(skill)
  // Dedup dependencies list via a set (erc1155 approves all ids in a single token contract)
  const dedupedAddressList = useMemo(
    () => (!tokenIdMap ? [] : [...(skillToDependencySet(skill)?.add(tokenIdMap.token) || [])]),
    [tokenIdMap, skill]
  )

  const { data } = useReadContracts({
    query: { enabled: Boolean(address && !!dedupedAddressList?.length) },
    contracts: useMemo(
      () =>
        dedupedAddressList.map((dep) => ({
          abi: Collection__factory.abi,
          address: dep,
          functionName: 'isApprovedForAll',
          args: address && mergeManager ? [address, mergeManager] : undefined
        })),
      [address, mergeManager, dedupedAddressList]
    )
  })

  return dedupedAddressList.map((addr, i) => ({ token: addr, approved: data?.[i]?.result as boolean }))
}

type IsApprovedForAllArgs = {
  skill?: SkillMetadata | null
}
type IsApprovedForAllResults = {
  approved: boolean
  flowSkill: SkillMetadata
  dependencyId: SkillId
}[]
type IsApprovedForAllConfig = MutationConfig<IsApprovedForAllResults, Error, IsApprovedForAllArgs> & {
  onSingleApproveSuccess: MutationConfig<IsApprovedForAllResults[number], Error, IsApprovedForAllArgs>['onSuccess']
}

async function _getApproved(
  args: IsApprovedForAllArgs & {
    checkApproval: (collectionAddr: `0x${string}`, operator?: `0x${string}` | undefined) => Promise<boolean>
  }
): Promise<IsApprovedForAllResults> {
  const { skill, checkApproval } = args
  if (!skill?.properties?.dependencies) return []
  try {
    const dedupedList = [...new Set(skill.properties.dependencies.flatMap((dep) => dep.token))]
    const approvalsList = await Promise.all(dedupedList.map((dep) => checkApproval(dep)))
    return approvalsList.map((res, i) => ({
      approved: res,
      flowSkill: skill,
      dependencyId: (dedupedList[i] + '-0000') as SkillId
    }))
  } catch (error: any) {
    const err = new Error(error)
    devError('[useForgeGetAllUnapprovedTokensForClaimableCallback] Error: ', err?.message || err)
    throw err
  }
}

const mutationFn = async (
  args: IsApprovedForAllArgs & {
    checkApproval: (collectionAddr: `0x${string}`, operator?: `0x${string}` | undefined) => Promise<boolean>
  }
) => {
  if (!args?.skill) throw new Error('Skill is required')
  return _getApproved(args)
}

export function useForgeGetAllUnapprovedTokensForClaimableCallback(
  params?: IsApprovedForAllArgs & IsApprovedForAllConfig
) {
  const checkApproval = useForgeCollectionApprovedCallback()
  const {
    mutate: mutate_,
    mutateAsync: mutateAsync_,
    ...rest
  } = useMutation({
    mutationFn: ({ skill }: { skill: SkillMetadata | null | undefined }) => mutationFn({ skill, checkApproval })
  })

  const mutate = useCallback((skill: SkillMetadata | null) => mutate_({ skill }), [mutate_])
  const mutateAsync = useCallback(
    async (skill: SkillMetadata | null) => {
      return (await mutateAsync_({ skill })).map((results) => {
        params?.onSingleApproveSuccess?.(results, { skill }, void 0)
        return results
      })
    },
    [mutateAsync_, params]
  )

  return {
    ...rest,
    mutate,
    mutateAsync
  }
}

export function useForgeApproveCallback() {
  const mergeManager = useForgeContractAddressesByChain(undefined, false)?.mergeManager
  const addPending = useAddPendingTransaction()
  const { writeContractAsync } = useWriteContract()

  return useCallback(
    async (tokenAddress: Address, forgeSkillId: SkillId) => {
      if (!mergeManager) throw new Error('Missing MergeManager contract address! Check function parameters!')
      return writeContractAsync({
        abi: Collection__factory.abi,
        address: tokenAddress,
        functionName: 'setApprovalForAll',
        args: [mergeManager, true]
      }).then((hash) => {
        addPending(hash as Hash, { metadata: { forgeSkillId, forgeTransactionType: 'approve' } })
        return hash
      })
    },
    [addPending, writeContractAsync, mergeManager]
  )
}

export function useForgeApproveAllBatchCallback() {
  const approveCallback = useForgeApproveCallback()

  return useCallback(
    async (tokenAddresses: Address[], forgeSkillId: SkillId) => {
      const dedupedList = [...new Set(tokenAddresses)]
      return Promise.all(dedupedList.map((addr) => approveCallback(addr, forgeSkillId)))
    },
    [approveCallback]
  )
}

export function useForgeApproveAllBatch(
  forgeSkillId: SkillId | undefined,
  unapprovedList: Address[],
  approveAddress?: Address
): (() => Promise<Address>)[] | null {
  const addPending = useAddPendingTransaction()
  const { writeContractAsync } = useWriteContract()
  const approveCallbacksList = useMemo(
    () =>
      !unapprovedList.length
        ? null
        : unapprovedList.map((tokenToApprove) => async () => {
            if (!approveAddress) throw new Error('Missing address of approvee! Check parameters!')
            return writeContractAsync({
              abi: ERC1155__factory.abi,
              functionName: 'setApprovalForAll',
              address: tokenToApprove,
              args: [approveAddress, true]
            }).then((tx) => {
              addPending(tx as Hash, { metadata: { forgeSkillId, forgeTransactionType: 'approve' } })
              return tx
            })
          }),
    [unapprovedList, writeContractAsync, approveAddress, addPending, forgeSkillId]
  )

  return approveCallbacksList as (() => Promise<Address>)[] | null
}

export function useForgeApproveAllTokensForClaimable(skill: SkillMetadata | null) {
  const mergeManager = useForgeContractAddressesByChain(undefined, false)?.mergeManager
  const unapprovedList = useForgeGetAllUnapprovedTokensForClaimable(skill)

  return useForgeApproveAllBatch(skill?.properties?.id, unapprovedList, mergeManager)
}

export function useForgeGetAllUnapprovedTokensForClaimable(skill: SkillMetadata | null) {
  const approvalsList = useForgeCheckClaimableSkillDependencyApprovalStatuses(skill)
  const unapprovedList = useMemo(() => filterToUnapprovedTokenList(approvalsList), [approvalsList])

  return unapprovedList
}

export function useForgeCollectionApprovedCallback() {
  const mergeManager = useForgeContractAddressesByChain(undefined, false)?.mergeManager
  const approveCall = useContractReadCallback()
  const { address } = useAccount()

  return useCallback(
    async (collectionAddr: Address, operator: Address | undefined = mergeManager) => {
      const response = await approveCall({
        abi: Collection__factory.abi,
        address: collectionAddr,
        functionName: 'isApprovedForAll',
        args: address && operator ? [address, operator] : undefined
      })

      return response.result as boolean
    },
    [address, approveCall, mergeManager]
  )
}

export function useForgeGetLockedSkillsApprovalStatuses(params?: {
  enabled?: boolean
  onIterationSuccess?: (data: {
    approved: boolean
    parentSkillId: SkillId
    token: `0x${string}`
    id: bigint
  }) => Promise<void>
  onIterationError?: (data: { approved: boolean; error: Error }) => Promise<void>
}) {
  const { enabled = true, onIterationError, onIterationSuccess } = params || {}
  const { address } = useAccount()
  const mergeManager = useForgeContractAddressesByChain(undefined, false)?.mergeManager
  const flattenedDepsList = useForgeFlattenedSkillDependencies({ hideNoBalance: true })

  const dedupedList = useDedupeList(flattenedDepsList)

  const result = useReadContracts({
    query: { enabled: Boolean(enabled && dedupedList?.length && address && mergeManager) },
    contracts: useMemo(
      () =>
        dedupedList.map((dep) => ({
          abi: Collection__factory.abi,
          address: dep.token,
          functionName: 'isApprovedForAll',
          args: address && mergeManager ? [address, mergeManager] : undefined
        })),
      [address, mergeManager, dedupedList]
    )
  })

  return {
    ...result,
    data: useMemo(
      () =>
        result.data?.map((res, i) => {
          const mappedResult = {
            ...dedupedList[i],
            approved: !!res.result
          }
          if (!res.error) {
            onIterationSuccess?.(mappedResult)
          } else {
            onIterationError?.({ ...mappedResult, error: res.error })
          }

          return mappedResult
        }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [result.data]
    )
  }
}

function filterToUnapprovedTokenList(
  approvalsList: {
    token: `0x${string}`
    approved: boolean
  }[]
): Address[] {
  if (!approvalsList?.length) return []

  const unapprovedList = approvalsList.reduce(
    (acc, appr) => (!appr.approved ? [...acc, appr.token] : acc),
    [] as Address[]
  )
  return unapprovedList
}
