import { useEffect } from 'react'

import { useForgeUserConfigAtom } from '..'
import { ForgeW3CoreProvidersProps, useChainId, useW3Connection } from '../../../'

type ForgeBalancesProps = ForgeW3CoreProvidersProps['config']
export function ForgeUserConfigUpdater({
  contractAddresses,
  metadataUris,
  web3: { chains },
  skillOptions
}: ForgeBalancesProps) {
  const chainId = useChainId()
  const [, , { address: account }] = useW3Connection()
  const [, updateUserConfig] = useForgeUserConfigAtom()
  useEffect(() => {
    updateUserConfig({
      chains,
      user: { account, chainId },
      ipfs: {
        gatewayUris: skillOptions?.metadataFetchOptions?.gatewayUris || [],
        gatewayApiUris: skillOptions?.metadataFetchOptions?.gatewayApiUris || []
      },
      metadataUriMap: metadataUris || {},
      contractAddressMap: contractAddresses || {}
    })
  }, [chains, chainId, account, contractAddresses, metadataUris, skillOptions?.metadataFetchOptions, updateUserConfig])

  return null
}
