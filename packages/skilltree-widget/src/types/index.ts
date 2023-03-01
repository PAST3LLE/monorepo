export interface SkilltreeMetadata<P, A = Record<any, any>> {
  name: string
  decimals?: number
  description: string
  image: string
  properties: P
  attributes?: A
}

export interface SkillProps<T> extends SkilltreeMetadata<T> {
  collectionMetadataUri: string
}

export type Rarity = 'common' | 'rare' | 'legendary' | 'epic'

export interface BaseProperties {
  rarity: Rarity
}
export interface CollectionProperties extends BaseProperties {
  size: number
}

export interface SkillDependencyObject {
  collection: number
  required: number
}

// TSDX rollup doesn't yet support the template string type
export type SkillId = string | `${string}-${string}`

export interface SkillProperties extends BaseProperties {
  id: SkillId
  shopifyId: string
  // TODO: fix this
  dependencies: SkillId /* | SkillDependencyObject */[]
}

export interface SkillAttributes {
  css?: string
  theme?: { bg: string; altBg: string; color: string }
  tags?: string[]
}

export type CollectionMetadata = SkilltreeMetadata<CollectionProperties>
export type SkillMetadata = SkilltreeMetadata<SkillProperties, SkillAttributes>
