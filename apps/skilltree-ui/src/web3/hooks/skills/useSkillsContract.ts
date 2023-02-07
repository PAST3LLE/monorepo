import { useContractAddressesByChain } from '../useContractAddress'
import { useSupportedChainId } from '../useSupportedChainId'
import { PSTLCollectionBaseSkills__factory } from '@past3lle/skilltree-contracts'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { Address, useContract, useProvider } from 'wagmi'
import { CallOverrides, PayableOverrides } from 'web3/types/functions'

// get SkillURI for collection 1
export function useSkillsContract() {
  const { skills } = useContractAddressesByChain()

  const chainId = useSupportedChainId()
  const provider = useProvider({ chainId })
  const skillsContract = useContract({
    abi: PSTLCollectionBaseSkills__factory.abi,
    address: skills[1],
    signerOrProvider: provider,
  })

  return {
    read: useMemo(
      () => ({
        balanceOf: async (account: Address, id: BigNumber, overrides?: CallOverrides) =>
          skillsContract?.balanceOf(account, id, overrides),
        balanceOfBatch: async (accountBatch: Address[], idBatch: BigNumber[], overrides?: CallOverrides) =>
          skillsContract?.balanceOfBatch(accountBatch, idBatch, overrides),
        getUri: async (id: number) => skillsContract?.uri(BigNumber.from(id)),
        getCollectionAddress: async (overrides?: CallOverrides) => skillsContract?.getCollectionAddress(overrides),
        getCollectionId: async (overrides?: CallOverrides) => skillsContract?.getCollectionId(overrides),
      }),
      [skillsContract]
    ),
    write: useMemo(
      () => ({
        mint: async (
          to: Address,
          id: BigNumber,
          amount: BigNumber,
          data: `0x${string}`,
          overrides?: PayableOverrides
        ) => skillsContract?.mint(to, id, amount, data, overrides),
        mintBatch: async (
          to: Address,
          idBatch: BigNumber[],
          amountBatch: BigNumber[],
          data: `0x${string}`,
          overrides?: PayableOverrides
        ) => skillsContract?.mintBatch(to, idBatch, amountBatch, data, overrides),
        pause: async (overrides?: PayableOverrides) => skillsContract?.pause(overrides),
        unpause: async (overrides?: PayableOverrides) => skillsContract?.unpause(overrides),
      }),
      [skillsContract]
    ),
  }
}
