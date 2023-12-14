import {
  SkillMetadata,
  chainFetchIpfsUriBlob,
  getHash,
  isIpfsUri,
  responseToBlob,
  useForgeGetIpfsAtom
} from '@past3lle/forge-web3'
import { devError } from '@past3lle/utils'
// import { useEffect, useState } from 'react'
import { useQuery } from 'wagmi'

import { ForgeQueries } from '../constants/keys'

export function useBuildMetadataImageUriQuery(metadata?: SkillMetadata) {
  const [ipfsConfig] = useForgeGetIpfsAtom()
  // const [formattedUri, setImageBlob] = useState<string>()

  return useQuery(
    [ForgeQueries.MetadataUri],
    async () => {
      if (!metadata) return undefined

      try {
        const isIpfsImageUri = isIpfsUri(metadata.image)
        const fetchFn = async () =>
          isIpfsImageUri
            ? chainFetchIpfsUriBlob(getHash(metadata.image), ...ipfsConfig.gatewayUris)
            : fetch(metadata.image).then(responseToBlob)

        return fetchFn()
      } catch (error) {
        devError('[SkillForge-Widget::Skillpoint/index.tsx] Error in fetching IPFS Uri Blob!', error)
        return undefined
      }
    },
    {
      queryHash: metadata?.image
    }
  )
}
