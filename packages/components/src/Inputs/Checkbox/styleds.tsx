import styled from 'styled-components'

export interface CheckboxProps {
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  checkedColor?: string
  checkedScale?: number
  boxSize?: string
}
const DEFAULT_SIZE = '2rem'
export const Checkbox = styled.input.attrs({ type: 'checkbox' })<CheckboxProps>`
  appearance: none;
  background-color: ${({ backgroundColor = '#fff' }) => backgroundColor};
  margin: 0;
  font: inherit;
  width: ${({ boxSize = DEFAULT_SIZE }) => boxSize};
  height: ${({ boxSize = DEFAULT_SIZE }) => boxSize};
  border: ${({ borderColor = 'rgba(0 0 0 / 0.25)' }) => `0.15em solid ${borderColor}`};
  border-radius: ${({ borderRadius = '2px' }) => borderRadius};
  cursor: pointer;
  transform: translateY(-0.075em);

  display: grid;
  place-content: center;

  &::before {
    content: '';
    width: ${({ boxSize = DEFAULT_SIZE }) => `calc(${boxSize} / 1.2)`};
    height: ${({ boxSize = DEFAULT_SIZE }) => `calc(${boxSize} / 1.2)`};
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: ${({ checkedColor = 'black', boxSize = DEFAULT_SIZE }) =>
      `inset ${boxSize} ${boxSize} ${checkedColor}`};
  }

  &:checked::before {
    transform: ${({ checkedScale = 0.86 }) => `scale(${checkedScale})`};
  }
`
