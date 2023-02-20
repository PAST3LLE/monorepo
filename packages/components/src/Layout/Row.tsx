import { Box, BoxProps } from 'rebass'
import styled from 'styled-components'

export type RowProps = {
  align?: string
  gap?: string
  padding?: string
  border?: string
  borderRadius?: string
} & BoxProps
export const Row = styled(Box)<RowProps>`
  width: ${({ width = '100%' }) => width};
  display: flex;
  padding: 0;
  align-items: ${({ alignItems = 'center' }) => alignItems};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  ${({ gap }) => gap && `gap: ${gap};`}
`

export const RowCenter = styled(Row)`
  justify-content: center;
  align-items: center;
`

export const RowBetween = styled(Row)`
  justify-content: space-between;
`

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`

export const AutoRow = styled(Row).attrs({ width: 'auto' })<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};

  & > * {
    margin: ${({ gap = '0px' }) => gap} !important;
  }
`

export const RowStart = styled(AutoRow).attrs((props) => ({ ...props, alignSelf: 'flex-start' }))``
export const RowEnd = styled(AutoRow).attrs((props) => ({ ...props, alignSelf: 'flex-end' }))``

export const RowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};
`
