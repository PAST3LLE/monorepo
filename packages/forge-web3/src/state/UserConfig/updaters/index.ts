import { usePstlUserConnectionInfo } from '@past3lle/web3-modal'
import { useEffect } from 'react'

import { useForgeUserConfigAtom } from '..'
import { ForgeW3CoreProvidersProps, useChainId } from '../../../'

type ForgeBalancesProps = ForgeW3CoreProvidersProps['config']
export function ForgeUserConfigUpdater({
  boardOptions,
  contractAddresses,
  metadataUris,
  web3: { chains },
  contactInfo,
  contentUrls,
  skillOptions
}: ForgeBalancesProps) {
  const chainId = useChainId()
  const { address: account } = usePstlUserConnectionInfo()
  const [, updateUserConfig] = useForgeUserConfigAtom()
  useEffect(() => {
    updateUserConfig((state) => ({
      chains,
      readonlyChain: chains[0],
      user: { account, chainId, contactInfo },
      board: { ...state.board, ...boardOptions },
      contentUrls,
      ipfs: {
        gatewayUris: skillOptions?.metadataFetchOptions?.gatewayUris || [],
        gatewayApiUris: skillOptions?.metadataFetchOptions?.gatewayApiUris || []
      },
      metadataUriMap: metadataUris || {},
      contractAddressMap: contractAddresses || {}
    }))
  }, [
    boardOptions,
    chains,
    chainId,
    account,
    contractAddresses,
    metadataUris,
    skillOptions?.metadataFetchOptions,
    contactInfo,
    contentUrls,
    updateUserConfig
  ])

  return null
}
