import { SkillMetadata } from '@past3lle/skillforge-web3'

export const SKILLPOINT_SIZES = {
  width: '9.7vmin',
  get height() {
    return this.width
  }
}
export const MINIMUM_COLLECTION_BOARD_SIZE = 4
export const EMPTY_COLLECTION_ROWS_SIZE = 6
export const MINIMUM_BOARD_WIDTH = 500
export const MINIMUM_BOARD_HEIGHT = 400
// TODO: REMOVE THIS!!!
export const MOCK_COLLECTION_ERROR_OFFSET = 1

export const EMPTY_SKILL_IMAGE_HASH_LIST = [
  'QmYrEBgtKLj9FG2aQzZRSF2BYPnB6XUGXT4qKPGH2dUqFh',
  'QmaQbfoGQuHG4PNeeV9c9QUfey1qXZ6Jhy684mHB2ARkYE',
  'QmbDnYPFWwtZNY5uPM1GaCaZEQPMmuhc14G4KsbnSxu4Pa',
  'QmaDv712Q5uZphJUDrkbUfBEw8hfiXzC7xLnkRu2pumriP',
  'QmenaY7aJzts2j1aV8ETVVL7ibh9g1azism7ab5w6qweU2',
  'QmaGSU7fpFXuAsfp7fWdbeWqYfAoyEVdtD6iscts2CFYoN'
]

export const SKILL_ID_BASE = 1000
export const SKILLPOINT_IMAGE_HASH = 'QmSMBa8KBK7QCJGVsViqAsUp5FQHQMC3qfmWH3wJxw219f'
export const SKILLPOINT_METADATA: SkillMetadata = {
  name: 'FORGE SKILLPOINT',
  description: 'Skillpoint for upgrading skills',
  image: SKILLPOINT_IMAGE_HASH,
  properties: {
    id: '0-0000',
    shopifyId: '0',
    dependencies: [],
    rarity: 'common'
  }
}
