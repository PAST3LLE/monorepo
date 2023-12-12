import { SkillMetadata, chainFetchIpfsUriBlob, getHash, useForgeGetIpfsAtom } from '@past3lle/forge-web3'
import { devError } from '@past3lle/utils'
import { useEffect, useState } from 'react'

export function useBuildMetadataImageUri(metadata?: SkillMetadata) {
  const [ipfsConfig] = useForgeGetIpfsAtom()
  const [formattedUri, setImageBlob] = useState<string>()
  useEffect(() => {
    if (!metadata?.image) return
    chainFetchIpfsUriBlob(getHash(metadata.image), ...ipfsConfig.gatewayUris)
      .then(setImageBlob)
      .catch((error) => {
        devError('[SkillForge-Widget::Skillpoint/index.tsx] Error in fetching IPFS Uri Blob!', error)
        setImageBlob(undefined)
      })
  }, [ipfsConfig.gatewayUris, metadata?.image])

  return formattedUri
}
