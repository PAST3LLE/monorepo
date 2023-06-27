import { MergeManager__factory } from '@past3lle/skilltree-contracts'
import { Address } from '@past3lle/types'
import { devError } from '@past3lle/utils'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { useForgeContractAddressMapReadAtom } from '../../state'
import { useSupportedChainId } from '../useForgeSupportedChainId'

export function useForgeClaimLockedSkill(args: { token: Address; id: bigint }) {
  const chainId = useSupportedChainId()
  const [contractAddresses] = useForgeContractAddressMapReadAtom()

  const mergeManager = chainId ? contractAddresses[chainId]?.mergeManager : undefined

  const { config, error } = usePrepareContractWrite({
    address: mergeManager,
    abi: MergeManager__factory.abi,
    functionName: 'claimLockedSkill',
    args: [args]
  })

  if (error) {
    devError('useForgeClaimLockedSkill prepare contract for write error!', error)
  }

  return useContractWrite(config)
}

export function useForgeUnpreparedClaimLockedSkill(args: { token: Address; id: bigint }) {
  const chainId = useSupportedChainId()
  const [contractAddresses] = useForgeContractAddressMapReadAtom()

  const mergeManager = chainId ? contractAddresses[chainId]?.mergeManager : undefined

  const config = {
    mode: 'recklesslyUnprepared',
    address: mergeManager,
    abi: MergeManager__factory.abi,
    functionName: 'claimLockedSkill',
    args: [args]
  }

  return useContractWrite(config as any)
}
