import { Text } from '@past3lle/components'
import React from 'react'
import { TextProps } from 'rebass'
import styled from 'styled-components/macro'

export const BlackBoldItalic = styled(Text.Black).attrs((props) => ({
  fontStyle: 'italic',
  fontWeight: 900,
  ...props,
}))``

export const BlackHeader = styled(BlackBoldItalic).attrs((props) => ({
  fontSize: '3.5rem',
  letterSpacing: -2,
  ...props,
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
  color: ${({ theme }) => theme.black};
  font-size: 6rem;
  ${({ whiteSpace }) => whiteSpace && `white-space: ${whiteSpace};`};
`
export const CursiveMonoHeader = ({
  text,
  capitalLetterProps,
  restWordProps,
}: {
  text: string
  capitalLetterProps?: TextProps
  restWordProps?: TextProps
}) => {
  const textArr = text.split(' ')
  const firstLetters: string[] = []
  const restWords: string[] = []
  for (let i = 0; i < textArr.length; i++) {
    const firstLetter = textArr[i][0]
    const restWord = textArr[i].slice(1)

    firstLetters.push(firstLetter)
    restWords.push(restWord)
  }

  return (
    <>
      {firstLetters.map((letter, idx) => (
        <CursiveHeader key={idx} {...capitalLetterProps} whiteSpace="nowrap">
          {letter}
          <MonospaceText {...restWordProps} display="inline-flex">
            {restWords[idx]}
          </MonospaceText>
        </CursiveHeader>
      ))}
    </>
  )
}
/* 
return (
    <CursiveHeader textAlign="left" fontSize="2.2rem">
      <MonospaceText display="inline-flex" color={'inherit'}>
        iew
      </MonospaceText>
    </CursiveHeader>
  )
*/
