import React from 'react'
import { TextProps as RebaseTextProps, Text as RebassText } from 'rebass'
import styled from 'styled-components'

type FVSMap = {
  wght?: number
  slnt?: number
  wdth?: number
  GRAD?: number
  YOPQ?: number
  YTAS?: number
  YTDE?: number
}
function _formatFvsMap(fvsMap?: FVSMap) {
  if (!fvsMap) return null
  return Object.entries(fvsMap)
    .flatMap(([name, val]) => {
      return `"${name}" ${val}`
    })
    .join(', ')
}

interface AuxProps {
  colour?: string
  fvs?: FVSMap
  fontVariationSettings?: FVSMap
}
const TextWrapper = styled(RebassText).attrs((props) => ({ fontSize: '1.2rem', ...props }))<AuxProps>`
  color: ${({ colour, theme }): string => colour && (theme as any)[colour]};
  ${({ fvs, fontVariationSettings }) => {
    const style = _formatFvsMap(fvs || fontVariationSettings)
    return style && `font-variation-settings: ${style};`
  }}
`
export type TextProps = RebaseTextProps & AuxProps
export const Text = {
  Main: styled((props: TextProps) => <TextWrapper fontWeight={500} {...props} colour="text2" />)``,
  Link: styled((props: TextProps) => <TextWrapper fontWeight={500} {...props} colour="primary1" />)``,
  Black: styled((props: TextProps) => <TextWrapper fontWeight={500} {...props} colour="black" />)``,
  White: styled((props: TextProps) => <TextWrapper fontWeight={500} {...props} colour="white" />)``,
  Body: styled((props: TextProps) => <TextWrapper fontWeight={400} fontSize={'1.6rem'} {...props} colour="text1" />)``,
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
  Blue: styled((props: TextProps) => <TextWrapper fontWeight={500} {...props} colour="primary1" />)``,
  Yellow: styled((props: TextProps) => <TextWrapper fontWeight={500} {...props} colour="yellow1" />)``,
  DarkGray: styled((props: TextProps) => <TextWrapper fontWeight={500} {...props} colour="text3" />)``,
  Gray: styled((props: TextProps) => <TextWrapper fontWeight={500} {...props} colour="bg3" />)``,
  Italic: styled((props: TextProps) => (
    <TextWrapper fontWeight={500} fontSize={'1.2rem'} fontStyle={'italic'} {...props} colour="text2" />
  ))``,
  Error: styled((props: TextProps) => <TextWrapper fontWeight={500} {...props} colour={'red1'} />)``
}
