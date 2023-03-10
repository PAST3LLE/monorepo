import Collection1Metadata from './1/1.json'
import Collection2Metadata from './2/2.json'
// import Collection3Metadata from './3/metadata.json'
import AllSkillsMetadata from './fullMetadata.js'
import { CollectionMetadata, SkillMetadata } from '../../types'

export const MOCK_COLLECTIONS_DATA = [
  Collection1Metadata as CollectionMetadata,
  Collection2Metadata as CollectionMetadata
  // Collection3Metadata as CollectionMetadata
] as const

export const MOCK_ALL_SKILLS_METADATA: SkillMetadata[][] = AllSkillsMetadata as SkillMetadata[][]
export const MOCK_SKILLS_COLLECTION_0: SkillMetadata[] = MOCK_ALL_SKILLS_METADATA[0]
export const MOCK_SKILLS_COLLECTION_1_5: SkillMetadata[] = MOCK_ALL_SKILLS_METADATA[1]
