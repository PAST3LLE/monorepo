import { CollectionMetadata, SkillMetadata } from './types'
import { get64PaddedSkillId, ipfsToImageUri } from './utils'
import { MOCK_COLLECTION_ERROR_OFFSET } from 'constants/skills'
import { useCallback } from 'react'
import { METADATA_URIS_MAP, SkillsCollectionIdGoerli, SkillsCollectionIdMumbai } from 'web3/constants/addresses'
import { useSupportedChainId } from 'web3/hooks/useSupportedChainId'

export interface UseMetaData {
  skills: (SkillMetadata[] | undefined)[]
  collection: CollectionMetadata | undefined
  collectionsMetadataList: CollectionMetadata[] | undefined
}
export function useFetchMetadataCallback() {
  const chainId = useSupportedChainId()
  const metadataUris = METADATA_URIS_MAP[chainId]

  return useCallback(
    async (collectionId: SkillsCollectionIdGoerli | SkillsCollectionIdMumbai): Promise<SkillMetadata[]> => {
      if (!metadataUris?.skills || !metadataUris?.collections) return []

      const { skills, collections } = metadataUris

      const collectionMetadata: CollectionMetadata = await (
        await fetch(collections.replace('{id}', collectionId.toString()))
      ).json()

      const size = collectionMetadata.properties.size
      const promisedSkillsMetadata: Promise<SkillMetadata>[] = []
      for (let i = 0; i < size; i++) {
        // TODO: remove this once contracts are fixed
        const realIdx = (collectionId + MOCK_COLLECTION_ERROR_OFFSET) as SkillsCollectionIdGoerli

        const skillId = get64PaddedSkillId(i)
        const uri = ipfsToImageUri(skills[realIdx].replace('{id}', skillId))
        promisedSkillsMetadata.push(fetch(uri).then((res) => res.json()))
      }

      return Promise.all(promisedSkillsMetadata)
    },
    [metadataUris]
  )
}
