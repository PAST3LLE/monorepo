import { BigNumber } from '@ethersproject/bignumber'
import { Collection__factory, CollectionsManager__factory } from '@past3lle/skilltree-contracts'
import { useMemo } from 'react'
import { Address, useContract, useContractRead, useProvider } from 'wagmi'

import { useSkillForgeContractAddressMapReadAtom } from '../../state'
import { CallOverrides, PayableOverrides } from '../../types'
import { WAGMI_SCOPE_KEYS } from '../constants'
import { WithCollectionId } from '../types'
import { useSupportedChainId } from '../useSkillForgeSupportedChainId'
import { useSkillForgeContractAddressesByChain } from './useSkillForgeContractAddress'

export function useSkillForgeCollectionContract({ collectionId }: WithCollectionId) {
  const [addressMap] = useSkillForgeContractAddressMapReadAtom()
  const contractAddressesByChain = useSkillForgeContractAddressesByChain(addressMap)
  const { data: address } = useContractRead({
    abi: CollectionsManager__factory.abi,
    functionName: 'collectionContract',
    args: [BigNumber.from(collectionId)],
    address: contractAddressesByChain?.collectionsManager,
    scopeKey: WAGMI_SCOPE_KEYS.SKILLS_CONTRACT
  })

  const chainId = useSupportedChainId()
  const provider = useProvider({ chainId })
  const collectionContract = useContract({
    abi: Collection__factory.abi,
    address,
    signerOrProvider: provider
  })

  return {
    read: useMemo(
      () => ({
        balanceOf: async (account: Address, id: BigNumber, overrides?: CallOverrides) =>
          collectionContract?.balanceOf(account, id, overrides),
        balanceOfBatch: async (accountBatch: Address[], idBatch: BigNumber[], overrides?: CallOverrides) =>
          collectionContract?.balanceOfBatch(accountBatch, idBatch, overrides),
        getUri: async (id: number) => collectionContract?.uri(BigNumber.from(id)),
        getCollectionAddress: async (overrides?: CallOverrides) => collectionContract?.getCollectionAddress(overrides),
        getCollectionId: async (overrides?: CallOverrides) => collectionContract?.getCollectionId(overrides)
      }),
      [collectionContract]
    ),
    write: useMemo(
      () => ({
        mint: async (to: Address, id: BigNumber, amount: BigNumber, data: Address, overrides?: PayableOverrides) =>
          collectionContract?.mint(to, id, amount, data, overrides),
        mintBatch: async (
          to: Address,
          idBatch: BigNumber[],
          amountBatch: BigNumber[],
          data: Address,
          overrides?: PayableOverrides
        ) => collectionContract?.mintBatch(to, idBatch, amountBatch, data, overrides),
        pause: async (overrides?: PayableOverrides) => collectionContract?.pause(overrides),
        unpause: async (overrides?: PayableOverrides) => collectionContract?.unpause(overrides)
      }),
      [collectionContract]
    )
  }
}
