import { CSSProperties, useCallback, useState } from 'react'
import React from 'react'

import { Select, SelectProps } from './styleds'

type ComponentProps = SelectProps & { style?: CSSProperties }
interface SelectorProps<V extends number | string> {
  defaultValue: V
  options: { value: V; label: string }[]
  name: string
  callback?: (value: V) => void
}
export function useSelect<V extends number | string>({
  name,
  options,
  defaultValue,
  callback
}: SelectorProps<V>): {
  Component: (props: ComponentProps) => React.JSX.Element
  store: [V, React.Dispatch<React.SetStateAction<V>>]
} {
  const [selection, setSelection] = useState<V>(defaultValue)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelection(e.target.value as V)
      callback?.(e.target.value as V)
    },
    [callback]
  )

  const Component = useCallback(
    ({ style, ...selectProps }: ComponentProps) => (
      <Select name={name} onChange={handleChange} style={style} value={selection} {...selectProps}>
        {options.map((opt) => (
          <option key={opt.value + '_' + opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, options, selection]
  )

  const memoisedSetSelection: React.Dispatch<React.SetStateAction<V>> = useCallback(
    (value) => setSelection(value as V),
    []
  )

  return { Component, store: [selection, memoisedSetSelection] }
}
