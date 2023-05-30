import { useEffect } from 'react'
import { ForgeW3CoreProvidersProps } from 'src'

import { useSkillForgeUserConfigAtom } from '..'

type SkillForgeBalancesProps = Pick<ForgeW3CoreProvidersProps['config']['web3'], 'chains'> &
  ForgeW3CoreProvidersProps['config']['skillOptions']
export function SkillForgeUserConfigUpdater({ chains, metadataFetchOptions }: SkillForgeBalancesProps) {
  const [, updateUserConfig] = useSkillForgeUserConfigAtom()
  useEffect(() => {
    updateUserConfig({
      chains,
      ipfs: {
        gatewayUris: metadataFetchOptions?.gatewayUris || [],
        gatewayApiUris: metadataFetchOptions?.gatewayApiUris || []
      }
    })
  }, [chains, metadataFetchOptions])

  return null
}
