import { useCallback, useState } from 'react'
import React from 'react'

import { InputProps } from './types'

export function useInputStore<V extends number | string | undefined>({
  defaultValue,
  callback
}: Pick<InputProps<V>, 'callback' | 'defaultValue'>): [
  V,
  {
    setState: React.Dispatch<React.SetStateAction<V>>
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | undefined) => void
  }
] {
  const [state, setState] = useState<V>(defaultValue)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | undefined) => {
      setState(e?.target.value as V)
      callback?.(e?.target.value as V)
    },
    [callback]
  )

  const memoisedSetSelection: React.Dispatch<React.SetStateAction<V>> = useCallback((value) => setState(value as V), [])

  return [state, { setState: memoisedSetSelection, handleChange }]
}
