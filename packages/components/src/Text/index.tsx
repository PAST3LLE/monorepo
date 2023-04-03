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
  Main: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper fvs={{ wght: fontWeight || 500, ...props.fvs }} {...props} colour="text2" />
  ))``,
  Link: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper fvs={{ wght: fontWeight || 500, ...props.fvs }} {...props} colour="primary1" />
  ))``,
  Black: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper fvs={{ wght: fontWeight || 500, ...props.fvs }} {...props} colour="black" />
  ))``,
  White: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper fvs={{ wght: fontWeight || 500, ...props.fvs }} {...props} colour="white" />
  ))``,
  Body: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper fvs={{ wght: fontWeight || 400, ...props.fvs }} fontSize={'1.6rem'} {...props} colour="text1" />
  ))``,
  Basic: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper
      fvs={{
        wght: fontWeight,
        ...props.fvs
      }}
      {...props}
    />
  ))``,
  Header: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper
      fontSize={'10rem'}
      letterSpacing={7}
      fvs={{ wght: fontWeight || 500, ...props.fvs }}
      fontStyle={'italic'}
      {...props}
    />
  ))``,
  SubHeader: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper
      fontSize={'1.8rem'}
      padding={2}
      margin={'2rem 0'}
      fvs={{ wght: fontWeight || 500, ...props.fvs }}
      fontStyle={'italic'}
      {...props}
    />
  ))``,
  LargeHeader: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper fvs={{ wght: fontWeight || 600, ...props.fvs }} fontSize={'2.4rem'} {...props} />
  ))``,
  MediumHeader: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper fvs={{ wght: fontWeight || 500, ...props.fvs }} fontSize={'2rem'} {...props} />
  ))``,
  Small: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper fvs={{ wght: fontWeight || 500, ...props.fvs }} fontSize={'1.1rem'} {...props} />
  ))``,
  Blue: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper fvs={{ wght: fontWeight || 500, ...props.fvs }} {...props} colour="primary1" />
  ))``,
  Yellow: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper fvs={{ wght: fontWeight || 500, ...props.fvs }} {...props} colour="yellow1" />
  ))``,
  DarkGray: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper fvs={{ wght: fontWeight || 500, ...props.fvs }} {...props} colour="text3" />
  ))``,
  Gray: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper fvs={{ wght: fontWeight || 500, ...props.fvs }} {...props} colour="bg3" />
  ))``,
  Italic: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper
      fvs={{ wght: fontWeight || 500, ...props.fvs }}
      fontSize={'1.2rem'}
      fontStyle={'italic'}
      {...props}
      colour="text2"
    />
  ))``,
  Error: styled(({ fontWeight, ...props }: TextProps) => (
    <TextWrapper fvs={{ wght: fontWeight || 500, ...props.fvs }} {...props} colour={'red1'} />
  ))``
}
