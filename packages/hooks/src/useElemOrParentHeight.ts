import { useEffect, useState } from 'react'

import { useDebouncedChangeHandler } from './useDebouncedChangeHandler'
import { UseWindowSizeOptions, useWindowSize } from './useWindowSize'

type ElemOrParentHeightProps = { findParent: boolean; elem: HTMLElement | null | undefined } & UseWindowSizeOptions

export function useElemOrParentHeight({ elem, findParent, throttleMs }: ElemOrParentHeightProps) {
  const windowSizes = useWindowSize()
  const [pHeight, setpHeight] = useState<number>()
  const [dpHeight, setdpHeight] = useDebouncedChangeHandler(pHeight, setpHeight, throttleMs)

  useEffect(() => {
    function handleWindowResize() {
      setdpHeight(findParent ? elem?.parentElement?.clientHeight : elem?.clientHeight)
    }
    if (elem) {
      // set it once
      dpHeight === undefined && handleWindowResize()
    }
  }, [elem, elem?.parentElement, windowSizes, dpHeight, findParent, setdpHeight])

  return dpHeight
}
