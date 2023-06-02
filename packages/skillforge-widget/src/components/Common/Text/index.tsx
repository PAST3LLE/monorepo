import { Text, TextProps } from '@past3lle/components'
import { setBestContrastingColour } from '@past3lle/theme'
import React, { useMemo } from 'react'
import styled from 'styled-components'

export const BlackBoldItalic = styled(Text.Black).attrs((props) => ({
  fontStyle: 'italic',
  fontWeight: 900,
  ...props
}))<{ borderRadius?: string; textShadow?: string }>`
  border-radius: ${({ borderRadius = '0' }) => borderRadius};
  ${({ textShadow }) => textShadow && `text-shadow: ${textShadow};`}
`

export const AutoColorHeader = styled(BlackBoldItalic)<{
  bgColour: string
  fgColour: string
}>`
  background-color: ${({ bgColour }) => bgColour};
  color: ${({ bgColour, fgColour, theme }) =>
    setBestContrastingColour({ bgColour, fgColour, lightColour: theme.mainFg, darkColour: 'black' })};
`

export const BlackHeader = styled(BlackBoldItalic).attrs((props) => ({
  fontSize: '3.5rem',
  letterSpacing: -2,
  ...props
}))`
  padding: 1rem;
  margin: 1rem 0;
`
export const ThemedHeader = styled(BlackHeader)`
  background-color: ${({ theme }) => theme.mainBg};
`

export const MonospaceText = styled(Text.Black)<{ cursor?: string }>`
  font-family: monospace;
  margin: 0;
  text-align: center;
  justify-content: center;
  ${({ cursor }) => cursor && `cursor: ${cursor};`}
`

export const CursiveText = styled(Text.Black)`
  font-family: 'Goth';
  margin: 0;
  text-align: center;
  justify-content: center;
  width: 100%;
`

export const CursiveHeader = styled(CursiveText)<{ whiteSpace?: string }>`
  color: ${({ theme }) => theme.mainText};
  font-size: 6rem;
  ${({ whiteSpace }) => whiteSpace && `white-space: ${whiteSpace};`};
`
export interface CursiveMonoHeaderProps {
  className?: string
  text: string
  capitalLetterProps?: TextProps & { zIndex?: number; textShadow?: string }
  restWordProps?: TextProps & { zIndex?: number; textShadow?: string }
}
const UnstyledCursiveMonoHeader = ({ text, className, capitalLetterProps, restWordProps }: CursiveMonoHeaderProps) => {
  const { firstLetters, restWords } = useMemo(() => {
    const textArr = text.split(' ')
    const firstLetters: string[] = []
    const restWords: string[] = []
    for (let i = 0; i < textArr.length; i++) {
      const firstLetter = textArr[i][0]
      const restWord = textArr[i].slice(1)

      firstLetters.push(firstLetter)
      restWords.push(restWord)
    }

    return { firstLetters, restWords }
  }, [text])

  return (
    <>
      {firstLetters.map((letter, idx) => (
        <CursiveHeader
          className={className}
          key={idx}
          style={{ zIndex: capitalLetterProps?.zIndex, textShadow: capitalLetterProps?.textShadow }}
          {...capitalLetterProps}
          whiteSpace="nowrap"
        >
          {letter}
          <Text.SubHeader
            fontWeight={100}
            fontFamily="Roboto"
            display="inline-flex"
            margin="0 0 0.2rem -0.4rem"
            padding={0}
            style={{ position: 'relative', zIndex: restWordProps?.zIndex, textShadow: restWordProps?.textShadow }}
            {...restWordProps}
          >
            {restWords[idx]}
          </Text.SubHeader>
        </CursiveHeader>
      ))}
    </>
  )
}

export const CursiveMonoHeader = styled(UnstyledCursiveMonoHeader)``
