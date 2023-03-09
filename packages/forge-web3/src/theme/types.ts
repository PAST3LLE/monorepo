export enum BaseSkillRarity {
  COMMON = 'common'
}

export interface BaseForgeTheme {
  mainText: string
  darkText: string
  lightText: string
  mainBg: string
  mainBgDarker: string
  mainBgAlt: string
  mainFg: string
  mainFgAlt: string

  // base rarity colours
  rarity: {
    [key in BaseSkillRarity]: {
      backgroundColor: string
      boxShadowColor: string
    }
  }
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends BaseForgeTheme {}
}
