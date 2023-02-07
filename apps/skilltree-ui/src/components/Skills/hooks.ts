import { CollectionMetadata, SkillMetadata } from './types'
import { COLLECTION_CONTRACTS_MAP } from 'mock/contracts'
import { MOCK_ALL_SKILLS_METADATA } from 'mock/metadata'
import { useCallback } from 'react'

export interface UseMetaData {
  skills: (SkillMetadata[] | undefined)[]
  collection: CollectionMetadata | undefined
  collectionsMetadataList: CollectionMetadata[] | undefined
}
export function useMetadata(/* collectionId?: number */) {
  // const [skills, setSkills] = useState<(SkillMetadata[] | undefined)[]>([])
  // const [collection, setCollectionMetadata] = useState<CollectionMetadata>()
  // const [collectionsMetadataList, setCollectionsMetadataList] = useState<CollectionMetadata[]>()

  useCallback(async () => {
    const collections721 = COLLECTION_CONTRACTS_MAP.CONTRACT_COLLECTIONS

    const uri = await collections721.getUri(1)
    const supply = await collections721.totalSupply()

    const promised = []
    for (let i = 1; i <= supply.toNumber(); i++) {
      promised.push(collections721.getSkillsAddress(i))
    }

    return {
      uri,
      supply,
      skillsAddressList: await Promise.all(promised),
    }
  }, [])

  return { skillsMetadata: MOCK_ALL_SKILLS_METADATA }
}
