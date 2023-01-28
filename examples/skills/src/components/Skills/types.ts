export interface SkilltreeMetadata<P> {
  name: string
  decimals?: number
  description: string
  image: string
  properties?: P
}

export interface SkillProps<T> extends SkilltreeMetadata<T> {
  collectionMetadataUri: string
}

export type CollectionMetadata = SkilltreeMetadata<{ skills: number; availableSkills: number }>
export type SkillMetadata = SkilltreeMetadata<never>
