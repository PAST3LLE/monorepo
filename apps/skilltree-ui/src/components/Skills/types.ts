export interface SkilltreeMetadata<P> {
  name: string
  decimals?: number
  description: string
  image: string
  properties: P
}

export interface SkillProps<T> extends SkilltreeMetadata<T> {
  collectionMetadataUri: string
}

export type Rarity = 'common' | 'rare' | 'legendary' | 'epic'

export interface BaseProperties {
  rarity: Rarity
}
export interface CollectionProperties extends BaseProperties {
  skills: number
}
export type SkillId = `${string}-${string}`
export interface SkillProperties extends BaseProperties {
  id: SkillId
  shopifyId: string
  dependencies: SkillId[]
}

export type CollectionMetadata = SkilltreeMetadata<CollectionProperties>
export type SkillMetadata = SkilltreeMetadata<SkillProperties>