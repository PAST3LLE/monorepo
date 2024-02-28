import styled from 'styled-components'

export interface SelectProps {
  arrowSize?: number
  arrowFillColor?: string
  arrowStrokeColor?: string
  arrowPositionX?: number
  arrowPositionY?: number
}
const DEFAULT_ARROW_SIZE = 35
export const Select = styled.select<SelectProps>`
  -webkit-appearance: none;
  -moz-appearance: none;

  background-image: url("data:image/svg+xml;utf8,<svg fill='${(props) => props.arrowFillColor || 'none'}' height=${({
    size = DEFAULT_ARROW_SIZE
  }) => `'${size}'`} width=${({ size = DEFAULT_ARROW_SIZE }) => `'${size}'`} viewBox='0 0 ${({
    size = DEFAULT_ARROW_SIZE
  }) =>
    `${Math.floor(size / 1.5)} ${Math.floor(
      size / 1.5
    )}`}' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z' stroke='${(props) =>
    props.arrowStrokeColor || 'black'}'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: ${({ arrowPositionX = 98 }) => arrowPositionX}%;
  background-position-y: ${({ arrowPositionY = 0 }) => arrowPositionY}px;

  padding-right: ${(props) => props.arrowSize || DEFAULT_ARROW_SIZE}px;
`
