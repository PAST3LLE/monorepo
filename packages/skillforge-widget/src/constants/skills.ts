import { SkillMetadata } from '@past3lle/forge-web3'

export const CANVAS_CONTAINER_ID = 'CANVAS-CONTAINER'
export const SKILLPOINTS_CONTAINER_ID = 'SKILLPOINTS-CONTAINER'
export const SKILLPOINT_SIZES = {
  width: '10vh',
  get height() {
    return this.width
  }
}
export const MINIMUM_COLLECTION_BOARD_SIZE = 4
export const EMPTY_COLLECTION_ROWS_SIZE = 6
export const MINIMUM_BOARD_WIDTH = 580
export const MINIMUM_BOARD_HEIGHT = 400

export const SKILLPOINT_IMAGE_HASH = 'QmSMBa8KBK7QCJGVsViqAsUp5FQHQMC3qfmWH3wJxw219f'
export const SKILLPOINT_METADATA: SkillMetadata = {
  name: 'FORGE SKILLPOINT',
  description: 'Skillpoint for upgrading skills',
  image: SKILLPOINT_IMAGE_HASH,
  properties: {
    id: '0x0-0000',
    shopifyId: '0',
    dependencies: [],
    rarity: 'common'
  }
}
