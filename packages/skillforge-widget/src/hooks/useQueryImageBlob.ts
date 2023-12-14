import { chainFetchIpfsUriBlob, getHash, isIpfsUri, responseToBlob, useForgeGetIpfsAtom } from '@past3lle/forge-web3'
import { devError } from '@past3lle/utils'
import { useQuery } from 'wagmi'

import { ForgeQueries } from '../constants/keys'

export function useQueryImageBlob(uri?: string) {
  const [ipfsConfig] = useForgeGetIpfsAtom()

  return useQuery(
    [ForgeQueries.MetadataUri],
    async () => {
      if (!uri) return undefined

      try {
        const isIpfsImageUri = isIpfsUri(uri)
        const fetchFn = async () =>
          isIpfsImageUri
            ? chainFetchIpfsUriBlob(getHash(uri), ...ipfsConfig.gatewayUris)
            : fetch(uri).then(responseToBlob)

        return fetchFn()
      } catch (error) {
        devError('[SkillForge-Widget::Skillpoint/index.tsx] Error in fetching IPFS Uri Blob!', error)
        return undefined
      }
    },
    {
      queryHash: uri
    }
  )
}
