import Collection1Metadata from '@past3lle/skills-nft/src/skills/1/metadata.json'
import Collection2Metadata from '@past3lle/skills-nft/src/skills/2/metadata.json'
import Collection3Metadata from '@past3lle/skills-nft/src/skills/3/metadata.json'
import AllSkillsMetadata from '@past3lle/skills-nft/src/skills/metadata.js'
import { CollectionMetadata, SkillMetadata } from 'components/Skills/types'

export const MOCK_COLLECTIONS_DATA = [
  Collection1Metadata as CollectionMetadata,
  Collection2Metadata as CollectionMetadata,
  Collection3Metadata as CollectionMetadata,
] as const

export const MOCK_ALL_SKILLS_METADATA: SkillMetadata[][] = AllSkillsMetadata
export const MOCK_SKILLS_COLLECTION_0: SkillMetadata[] = MOCK_ALL_SKILLS_METADATA[0]
export const MOCK_SKILLS_COLLECTION_1_5: SkillMetadata[] = MOCK_ALL_SKILLS_METADATA[1]
