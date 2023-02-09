import { Box } from 'rebass'
import styled from 'styled-components'

import { RowProps } from './Row'

export const Column = styled(Box)<RowProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  ${({ gap }) => gap && `gap: ${gap};`}
`
export const ColumnCenter = styled(Column)`
  width: 100%;
  align-items: center;
`

export const AutoColumn = styled(Column)<{
  gap?: 'sm' | 'md' | 'lg' | string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between' | 'space-evenly'
}>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  ${({ justifyItems }) => justifyItems && `justify-items: ${justifyItems};`}
`

export const FixedColumn = styled(AutoColumn)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`
