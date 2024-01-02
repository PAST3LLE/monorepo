import { MergeManager__factory } from '@past3lle/skilltree-contracts'
import { Address } from '@past3lle/types'
import { devDebug, devError } from '@past3lle/utils'
import { useAddPendingTransaction } from '@past3lle/web3-modal'
import { useCallback } from 'react'
import { Hash } from 'viem'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { useForgeContractAddressMapReadAtom } from '../../state'
import { SkillMetadata } from '../../types'
import { formatSkillMetadataToArgs } from '../../utils'
import { useSupportedChainId } from '../useForgeSupportedChainId'
import { useContractWriteCallback, useForgeSkillMetadataToArg } from './base'
import { useForgeApproveAllTokensForClaimable, useForgeGetAllUnapprovedTokensForClaimable } from './useForgeApprove'
import { useForgeContractAddressesByChain } from './useForgeContractAddress'

export function useForgeClaimLockedSkill(skill: SkillMetadata | null) {
  const mergeManager = useForgeContractAddressesByChain(undefined, false)?.mergeManager
  const arg = useForgeSkillMetadataToArg(skill)
  const unapprovedList = useForgeGetAllUnapprovedTokensForClaimable(skill)
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
        addPending(res.hash, {
          metadata: {
            forgeSkillId: skill?.properties?.id,
            forgeTransactionType: 'claim'
          }
        })
        return res
      })
    }
  }
}

export function useForgeClaimLockedSkillCallback() {
  const mergeManager = useForgeContractAddressesByChain(undefined, false)?.mergeManager
  const addPending = useAddPendingTransaction()

  const claimLockedSkill = useContractWriteCallback()

  return useCallback(
    async (skill: SkillMetadata | null) => {
      const formattedArgs = formatSkillMetadataToArgs(skill)
      // if (!mergeManager) return
      return claimLockedSkill({
        address: mergeManager,
        abi: MergeManager__factory.abi,
        functionName: 'claimLockedSkill',
        args: formattedArgs ? [formattedArgs] : undefined
      }).then((hash) => {
        addPending(hash as Hash, { metadata: { forgeSkillId: skill?.properties.id, forgeTransactionType: 'claim' } })
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
  onApproveSend: (hash: Address | undefined, approvalsRequired: number) => void
  onClaimSend: (hash: Address | undefined) => void
}
export function useForgeApproveAndClaimLockedSkillCallback(
  skill: SkillMetadata | null,
  opts?: ClaimLockedSkillOpts
): [Omit<ReturnType<typeof useForgeClaimLockedSkill>, 'writeAsync'>, () => Promise<void | undefined>] {
  const approveAllTokensCallbacks = useForgeApproveAllTokensForClaimable(skill)
  const { writeAsync: claimLockedSkill, ...claimLockedSkillApi } = useForgeClaimLockedSkill(skill)

  const approveAndClaimCallback = useCallback(async () => {
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
        await Promise.all(
          approveAllTokensCallbacks.map((callback) =>
            callback().then((res) => opts?.onApproveSend(res, approveAllTokensCallbacks?.length || 0))
          )
        )
      }

      // Step 2:
      return claimLockedSkill?.().then((res) => opts?.onClaimSend(res?.hash))
    } catch (error) {
      devError('[@past3lle/forge-web3] --> useForgeApproveAndClaimLockedSkillCallback --> Error!', error)
      throw error
    }
  }, [approveAllTokensCallbacks, claimLockedSkill, opts])

  return [claimLockedSkillApi, approveAndClaimCallback]
}
