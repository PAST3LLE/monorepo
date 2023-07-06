import { getIsMobile } from '@past3lle/utils'

import { useIsSmallMediaWidth } from './useWindowSize'

export function useIsMobile() {
  const isMobileWidth = useIsSmallMediaWidth()

  return isMobileWidth || getIsMobile()
}
