import { CSSProperties, useCallback } from 'react'
import React from 'react'

import { useInputStore } from '../baseHook'
import { InputProps } from '../types'
import { Select, SelectProps } from './styleds'

type ComponentProps = SelectProps & { style?: CSSProperties }

export function useSelect<V extends number | string | undefined>({
  name,
  options,
  defaultValue,
  callback
}: InputProps<V>): {
  Component: (props: ComponentProps) => React.JSX.Element
  store: [V, React.Dispatch<React.SetStateAction<V>>]
} {
  const [selection, { setState: setSelection, handleChange }] = useInputStore({ callback, defaultValue })

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

  return { Component, store: [selection, setSelection] }
}
