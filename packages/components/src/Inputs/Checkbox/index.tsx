import { CSSProperties, useCallback } from 'react'
import React from 'react'

import { useInputStore } from '../baseHook'
import { InputProps } from '../types'
import { Checkbox, CheckboxProps } from './styleds'

type ComponentProps = CheckboxProps & { style?: CSSProperties }

export function useCheckboxes<V extends number | string | undefined>({
  name,
  options,
  defaultValue,
  callback
}: InputProps<V>): {
  Component: (props: ComponentProps) => React.JSX.Element
  store: [V, React.Dispatch<React.SetStateAction<V>>]
} {
  const [checked, { setState: setChecked, handleChange }] = useInputStore({ callback, defaultValue })

  const auxHandleChanged = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      if (!!checked) handleChange(undefined)
      else handleChange(e)
    },
    [checked, handleChange]
  )

  const Component = useCallback(
    ({ style, ...restProps }: ComponentProps) => (
      <>
        {options.map((opt) => (
          <Checkbox
            key={opt.value + '_' + opt.label}
            name={name}
            onChange={auxHandleChanged}
            style={style}
            value={opt.value}
            checked={checked == opt.value}
            {...restProps}
          />
        ))}
      </>
    ),
    [options, name, auxHandleChanged, checked]
  )

  return { Component, store: [checked, setChecked] }
}
