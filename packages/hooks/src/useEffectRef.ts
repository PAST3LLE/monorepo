import { MutableRefObject, useEffect, useRef, useState } from 'react'

export function useEffectRef<T>(defaultRefValue: any) {
  const [refToObserve, setRefToObserve] = useState<MutableRefObject<T>>()
  const refToSet = useRef<T>(defaultRefValue)
  useEffect(() => {
    setRefToObserve(refToSet)
  }, [])

  return [refToSet, refToObserve ?? null]
}
