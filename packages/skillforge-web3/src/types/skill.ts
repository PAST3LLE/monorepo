import { BigNumber } from '@ethersproject/bignumber'
import { Address } from 'wagmi'

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

export type SkillRarity = 'empty' | 'common' | 'rare' | 'legendary' | 'epic'

interface BaseProperties {
  rarity: SkillRarity
}
interface CollectionProperties extends BaseProperties {
  ids: number[]
}

export interface SkillDependencyObject {
  token: Address
  id: BigNumber
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

export type CollectionMetadata = SkilltreeMetadata<CollectionProperties>
export type SkillMetadata = SkilltreeMetadata<SkillProperties, SkillAttributes>
