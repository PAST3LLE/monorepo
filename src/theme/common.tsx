import React, { ReactElement } from 'react'
import { Text, TextProps } from 'rebass'
import styled from 'styled-components'
import { Colors } from './styled'

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }): string => (theme as never)[color]};
  font-size: 1.2rem;
`

export const LayoutText = {
  main(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} color="text2" {...props} />
  },
  link(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} color="primary1" {...props} />
  },
  black(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} color="black" {...props} />
  },
  white(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} color="white" {...props} />
  },
  body(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={400} fontSize={'1.6rem'} color="text1" {...props} />
  },
  productText(props: TextProps): ReactElement {
    return <TextWrapper color={'products.aside.textColor'} fontWeight={500} {...props} />
  },
  basic(props: TextProps): ReactElement {
    return <TextWrapper {...props} />
  },
  header(props: TextProps): ReactElement {
    return <TextWrapper fontSize={'10rem'} letterSpacing={7} fontWeight={500} fontStyle={'italic'} {...props} />
  },
  subHeader(props: TextProps): ReactElement {
    return (
      <TextWrapper fontSize={'1.8rem'} padding={2} margin={'2rem 0'} fontWeight={500} fontStyle={'italic'} {...props} />
    )
  },
  largeHeader(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={600} fontSize={'2.4rem'} {...props} />
  },
  mediumHeader(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} fontSize={'2rem'} {...props} />
  },
  small(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} fontSize={'1.1rem'} {...props} />
  },
  blue(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} color="primary1" {...props} />
  },
  yellow(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} color="yellow1" {...props} />
  },
  darkGray(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} color="text3" {...props} />
  },
  gray(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} color="bg3" {...props} />
  },
  italic(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} fontSize={'1.2rem'} fontStyle={'italic'} color="text2" {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps): ReactElement {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  },
}
