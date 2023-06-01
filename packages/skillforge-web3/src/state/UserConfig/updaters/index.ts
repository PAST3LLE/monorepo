import { useEffect } from 'react'

import { useSkillForgeUserConfigAtom } from '..'
import { ForgeW3CoreProvidersProps } from '../../../'

type SkillForgeBalancesProps = ForgeW3CoreProvidersProps['config']
export function SkillForgeUserConfigUpdater({
  contractAddresses,
  metadataUris,
  web3: { chains },
  skillOptions
}: SkillForgeBalancesProps) {
  const [, updateUserConfig] = useSkillForgeUserConfigAtom()
  useEffect(() => {
    updateUserConfig({
      chains,
      ipfs: {
        gatewayUris: skillOptions?.metadataFetchOptions?.gatewayUris || [],
        gatewayApiUris: skillOptions?.metadataFetchOptions?.gatewayApiUris || []
      },
      metadataUriMap: metadataUris || {},
      contractAddressMap: contractAddresses || {}
    })
  }, [chains, contractAddresses, metadataUris, skillOptions?.metadataFetchOptions, updateUserConfig])

  return null
}
