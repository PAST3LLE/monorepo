import { useState, useEffect } from 'react'
import debounce from 'lodash.debounce'
import { useDebouncedChangeHandler } from './useDebouncedChangeHandler'

type ElemOrParentHeightProps = { findParent: boolean; elem: HTMLElement | null | undefined }

export function useElemOrParentHeight({ elem, findParent }: ElemOrParentHeightProps) {
  const [pHeight, setpHeight] = useState<number>()
  const [dpHeight, setdpHeight] = useDebouncedChangeHandler(pHeight, setpHeight, 300)

  useEffect(() => {
    function handleWindowResize() {
      setdpHeight(findParent ? elem?.parentElement?.clientHeight : elem?.clientHeight)
    }
    if (elem) {
      // attach listener to reset size if resized
      window.addEventListener('resize', debounce(handleWindowResize, 400))
      // set it once
      dpHeight === undefined && handleWindowResize()
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [elem, elem?.parentElement, dpHeight, setdpHeight, findParent])

  return dpHeight
}
