import { isMobile } from '@past3lle-schematics/utils'

export const BASE_FONT_SIZE = 10
export const LAYOUT_REM_SIZE_MAP = {
  HEADER: 8,
  FOOTER: 10,
  NAV: 12,
}
export const LAYOUT_VIEW_SIZE_MAP = {
  HEADER: 8,
  FOOTER: 15,
  NAV: 12,
}
export const HEADER_FOOTER_HEIGHT_REM = LAYOUT_REM_SIZE_MAP.FOOTER + LAYOUT_REM_SIZE_MAP.HEADER
export const SIZE_RATIOS = {
  16_9: {
    landscape: 16 / 9,
    vertical: 9 / 16,
  },
}
export const SINGLE_PRODUCT_LOGO_MARGIN_TOP_OFFSET = isMobile ? 0.151 : 0.185
