import React from 'react'
import { Text as RebassText, type TextProps } from 'rebass'
import styled from 'styled-components'

const TextWrapper = styled(RebassText).attrs((props) => ({ fontSize: '1.2rem', ...props }))<{ colour: string }>`
  color: ${({ colour, theme }): string => (theme as any)[colour]};
`

const Text = {
  Main: styled((props: TextProps) => <TextWrapper fontWeight={500} colour="text2" {...props} />)``,
  Link: styled((props: TextProps) => <TextWrapper fontWeight={500} colour="primary1" {...props} />)``,
  Black: styled((props: TextProps) => <TextWrapper fontWeight={500} colour="black" {...props} />)``,
  White: styled((props: TextProps) => <TextWrapper fontWeight={500} colour="white" {...props} />)``,
  Body: styled((props: TextProps) => <TextWrapper fontWeight={400} fontSize={'1.6rem'} colour="text1" {...props} />)``,
  Basic: styled((props: TextProps) => <TextWrapper {...props} />)``,
  Header: styled((props: TextProps) => (
    <TextWrapper fontSize={'10rem'} letterSpacing={7} fontWeight={500} fontStyle={'italic'} {...props} />
  ))``,
  SubHeader: styled((props: TextProps) => (
    <TextWrapper fontSize={'1.8rem'} padding={2} margin={'2rem 0'} fontWeight={500} fontStyle={'italic'} {...props} />
  ))``,
  LargeHeader: styled((props: TextProps) => <TextWrapper fontWeight={600} fontSize={'2.4rem'} {...props} />)``,
  MediumHeader: styled((props: TextProps) => <TextWrapper fontWeight={500} fontSize={'2rem'} {...props} />)``,
  Small: styled((props: TextProps) => <TextWrapper fontWeight={500} fontSize={'1.1rem'} {...props} />)``,
  Blue: styled((props: TextProps) => <TextWrapper fontWeight={500} colour="primary1" {...props} />)``,
  Yellow: styled((props: TextProps) => <TextWrapper fontWeight={500} colour="yellow1" {...props} />)``,
  DarkGray: styled((props: TextProps) => <TextWrapper fontWeight={500} colour="text3" {...props} />)``,
  Gray: styled((props: TextProps) => <TextWrapper fontWeight={500} colour="bg3" {...props} />)``,
  Italic: styled((props: TextProps) => (
    <TextWrapper fontWeight={500} fontSize={'1.2rem'} fontStyle={'italic'} colour="text2" {...props} />
  ))``,
  Error: styled((props: TextProps) => <TextWrapper fontWeight={500} colour={'red1'} {...props} />)``
}

export { Text, type TextProps }
