import { MediaWidths } from '@past3lle/theme'
import { GenericImageSrcSet } from '@past3lle/types'

export function makeSimpleGenericImageSrcSet(url: string): GenericImageSrcSet<MediaWidths> {
  return {
    defaultUrl: url,
    500: { '1x': url },
    720: { '1x': url },
    960: { '1x': url },
    1280: { '1x': url },
    1440: { '1x': url }
  }
}
