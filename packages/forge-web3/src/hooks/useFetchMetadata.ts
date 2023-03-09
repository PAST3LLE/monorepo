import { devWarn } from '@past3lle/utils'
import { useCallback } from 'react'

import { MetadataState, MetadataUpdaterProps } from '../state'
import { CollectionMetadata, SkillMetadata } from '../types'
import { get64PaddedSkillId, ipfsToImageUri } from '../utils'
import { useSupportedChainId } from './useSupportedChainId'

export interface UseMetaData {
  skills: (SkillMetadata[] | undefined)[]
  collection: CollectionMetadata | undefined
  collectionsMetadataList: CollectionMetadata[] | undefined
}

type FetchMetadataProps = Omit<MetadataUpdaterProps, 'contractAddressMap'>

export function useFetchMetadataCallback({ metadataUriMap, idBase }: FetchMetadataProps) {
  const chainId = useSupportedChainId()
  const metadataUris = metadataUriMap[chainId]

  return useCallback(
    async (collectionId: number): Promise<MetadataState['metadata'][0]> => {
      if (!metadataUris?.skills || !metadataUris?.collections) return { size: 0, skillsMetadata: [] }

      const { skills, collections } = metadataUris

      const collectionMetadata: CollectionMetadata = await (
        await fetch(collections.replace('{id}', collectionId.toString()))
      ).json()

      const size = collectionMetadata.properties.size
      const promisedSkillsMetadata: Promise<SkillMetadata>[] = []

      for (let i = 0; i < size; i++) {
        const ipfsUri = skills[collectionId]?.uri

        // skip if no uri
        if (!ipfsUri) {
          devWarn('[useFetchMetadataCallback]::No skills metadata URI found at collectionId', collectionId)
          continue
        }

        const skillId = get64PaddedSkillId(i, idBase)
        const uri = ipfsToImageUri(ipfsUri.replace('{id}', skillId))
        promisedSkillsMetadata.push(fetch(uri).then((res) => res.json()))
      }

      return { size, skillsMetadata: await Promise.all(promisedSkillsMetadata) }
    },
    [metadataUris]
  )
}
