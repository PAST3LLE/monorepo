import { SkillRarity } from '../types'
import { SkilltreeTheme } from './types'

export const baseTheme: Omit<SkilltreeTheme, 'assetsMap'> = {
  mainText: '#fff',
  darkText: '#000',
  lightText: 'ghostwhite',
  mainBg: '#d5fb73',
  mainBgDarker: '#94c614',
  mainBgAlt: '#262528',
  mainFg: 'ghostwhite',
  mainFgAlt: '#d5fb73',

  button: {
    mainBg: '#475548',
    mainBgLight: '#deefe1',
    altBg: '#281d25',
    altBgLight: '#b6abb6',
    border: {
      radius: '0.5rem',
      colour: 'transparent',
      border: 'none'
    },
    fontSize: {
      small: '0.8rem',
      normal: '1rem',
      large: '1.5rem'
    },
    hoverColour: 'cornflowerblue'
  },
  // rarity colours
  rarity: {
    [SkillRarity.EMPTY]: {
      backgroundColor: 'transparent',
      boxShadowColor: '0px 0px transparent'
    },
    [SkillRarity.COMMON]: {
      backgroundColor: '#969696b3',
      boxShadowColor: '12px 2px #969696b3'
    },
    [SkillRarity.RARE]: { backgroundColor: '#6495ed', boxShadowColor: '12px 2px #6495ed' },
    [SkillRarity.LEGENDARY]: {
      backgroundColor: '#ab64ffbd',
      boxShadowColor: '12px 8px #8000809e'
    },
    [SkillRarity.EPIC]: { backgroundColor: '#ffb467', boxShadowColor: '12px 8px #ffb467' }
  },
  gradients: {
    lockedSkill: 'linear-gradient(195deg, lightgrey, darkred)',
    unlockedSkill: 'linear-gradient(195deg, lightgrey,',
    ownedSkill: 'linear-gradient(195deg, lightgrey, #208120)'
  }
} as const
