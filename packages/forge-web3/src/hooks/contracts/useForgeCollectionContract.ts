import { BigNumber } from '@ethersproject/bignumber'
import { Collection__factory, CollectionsManager__factory } from '@past3lle/skilltree-contracts'
import { useMemo } from 'react'
import { Address, useContract, useContractRead, useProvider } from 'wagmi'

import { useForgeContractAddressMapReadAtom } from '../../state'
import { WAGMI_SCOPE_KEYS } from '../constants'
import { WithCollectionId } from '../types'
import { useSupportedChainId } from '../useForgeSupportedChainId'
import { useForgeContractAddressesByChain } from './useForgeContractAddress'

export function useForgeCollectionContract({ collectionId }: WithCollectionId) {
  const [addressMap] = useForgeContractAddressMapReadAtom()
  const contractAddressesByChain = useForgeContractAddressesByChain(addressMap)
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
        balanceOf: async (account: Address, id: BigNumber) =>
          collectionContract?.balanceOf(account, id),
        balanceOfBatch: async (accountBatch: Address[], idBatch: BigNumber[] ) =>
          collectionContract?.balanceOfBatch(accountBatch, idBatch),
        getUri: async (id: number) => collectionContract?.uri(BigNumber.from(id)),
        getCollectionAddress: async () => collectionContract?.getCollectionAddress(),
        getCollectionId: async () => collectionContract?.getCollectionId()
      }),
      [collectionContract]
    ),
    write: useMemo(
      () => ({
        mint: async (to: Address, id: BigNumber, amount: BigNumber, data: Address) =>
          collectionContract?.mint(to, id, amount, data),
        mintBatch: async (
          to: Address,
          idBatch: BigNumber[],
          amountBatch: BigNumber[],
          data: Address,
        ) => collectionContract?.mintBatch(to, idBatch, amountBatch, data),
        pause: async () => collectionContract?.pause(),
        unpause: async () => collectionContract?.unpause()
      }),
      [collectionContract]
    )
  }
}
