import { Address } from 'wagmi'

export interface ForgeMetadata<P, A = Record<any, any>> {
  name: string
  decimals?: number
  description: string
  image: string
  properties: P
  attributes?: A
}

export interface SkillProps<T> extends ForgeMetadata<T> {
  collectionMetadataUri: string
}

export type SkillRarity = 'empty' | 'common' | 'rare' | 'legendary' | 'epic'

interface BaseProperties {
  rarity: SkillRarity
}
interface CollectionProperties extends BaseProperties {
  ids: number[]
}

export interface SkillDependencyObject {
  token: Address
  id: bigint
}
export type SkillId = `${Address}-${string}`
export interface SkillProperties extends BaseProperties {
  id: SkillId
  shopifyId: string
  dependencies: SkillDependencyObject[]
}

export interface SkillAttributes {
  handle?: string
  css?: string
  tags?: string[]
  theme?: { bg: string; altBg: string; color: string }
}

export type CollectionMetadata = ForgeMetadata<CollectionProperties>
export type SkillMetadata = ForgeMetadata<SkillProperties, SkillAttributes>
