export interface SkillMetadata {
  description: string
  name: string
  image: string
}

export interface SkillpointProps extends Omit<SkillMetadata, 'image'> {
  id: string
  collectionUri: string
  image?: string
}
