import { Abi, Address, Narrow } from 'abitype'
import { useNetwork, usePrepareContractWrite } from 'wagmi'

import { SupportedChains } from '../../types'

export function useSkillForgePrepareContract<TAbi extends Narrow<Abi | readonly unknown[]> | undefined>(
  abi: TAbi,
  address: Address | undefined
) {
  const { chain } = useNetwork()
  const chainId = (chain?.id as SupportedChains) || SupportedChains.POLYGON_MUMBAI

  const { config } = usePrepareContractWrite({
    abi,
    chainId,
    address
  })

  return config
}
