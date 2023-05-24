import { Abi, Address, Narrow } from 'abitype'
import { usePrepareContractWrite } from 'wagmi'

import { useSupportedChainId } from '../useSkillForgeSupportedChainId'

export function useSkillForgePrepareContract<TAbi extends Narrow<Abi | readonly unknown[]> | undefined>(
  abi: TAbi,
  address: Address | undefined
) {
  const chainId = useSupportedChainId()

  const { config } = usePrepareContractWrite({
    abi,
    chainId,
    address
  })

  return config
}
