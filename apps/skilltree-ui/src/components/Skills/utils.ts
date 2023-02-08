import { Rarity, SkillMetadata } from './types'
import { GATEWAY_URI } from 'constants/ipfs'

export const getHash = (uri: string) => (uri.startsWith('ipfs://') ? uri.substring(7) : uri)

export async function getTokenUri(imageUri: SkillMetadata['image']) {
  const skillMetaData: SkillMetadata = await (await fetch(imageUri)).json()
  const skillUriHash = getHash(skillMetaData.image)

  return `${GATEWAY_URI}/${skillUriHash}`
}

export function getRarityColours(rarity?: Rarity) {
  switch (rarity) {
    case 'rare':
      return { backgroundColor: '#6495ed', boxShadowColor: '12px 8px #6495ed' }
    case 'legendary':
      return {
        backgroundColor: '#ab64ffbd',
        boxShadowColor: '12px 8px #8000809e',
      }
    case 'epic':
      return { backgroundColor: '#ffb467', boxShadowColor: '12px 8px #ffb467' }
    default:
      // is common or unset
      return {
        backgroundColor: '#969696b3',
        boxShadowColor: '12px 2px #969696b3',
      }
  }
}
