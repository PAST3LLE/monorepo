import { Colors } from '@past3lle/theme'
import React, { ReactElement } from 'react'
import { Text as RebassText, TextProps } from 'rebass'
import styled from 'styled-components'

const TextWrapper = styled(RebassText).attrs((props) => ({ fontSize: '1.2rem', ...props }))<{ colour: keyof Colors }>`
  color: ${({ colour, theme }): string => (theme as Colors)[colour]};
`

export const Text = {
  Main(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} colour="text2" {...props} />
  },
  Link(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} colour="primary1" {...props} />
  },
  Black(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} colour="black" {...props} />
  },
  White(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} colour="white" {...props} />
  },
  Body(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={400} fontSize={'1.6rem'} colour="text1" {...props} />
  },
  Basic(props: TextProps): ReactElement {
    return <TextWrapper {...props} />
  },
  Header(props: TextProps): ReactElement {
    return <TextWrapper fontSize={'10rem'} letterSpacing={7} fontWeight={500} fontStyle={'italic'} {...props} />
  },
  SubHeader(props: TextProps): ReactElement {
    return (
      <TextWrapper fontSize={'1.8rem'} padding={2} margin={'2rem 0'} fontWeight={500} fontStyle={'italic'} {...props} />
    )
  },
  LargeHeader(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={600} fontSize={'2.4rem'} {...props} />
  },
  MediumHeader(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} fontSize={'2rem'} {...props} />
  },
  Small(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} fontSize={'1.1rem'} {...props} />
  },
  Blue(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} colour="primary1" {...props} />
  },
  Yellow(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} colour="yellow1" {...props} />
  },
  DarkGray(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} colour="text3" {...props} />
  },
  Gray(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} colour="bg3" {...props} />
  },
  Italic(props: TextProps): ReactElement {
    return <TextWrapper fontWeight={500} fontSize={'1.2rem'} fontStyle={'italic'} colour="text2" {...props} />
  },
  Error({ error, ...props }: { error: boolean } & TextProps): ReactElement {
    return <TextWrapper fontWeight={500} colour={error ? 'red1' : 'text2'} {...props} />
  }
}
