import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useAppMessagesReadAtom } from '../../state/AppMessages'

export const BannerContainer = styled.div`
  width: 100%;
  height: 50px;
  background: ${({ theme }) => theme.mainBg};
  text-align: center;
  font-variation-settings: 'wght' 100;
`

export function AppMessagesBanner() {
  const [appMessages] = useAppMessagesReadAtom()

  const appMessagesFiltered = useMemo(() => Object.values(appMessages).filter(Boolean), [appMessages])

  if (!appMessagesFiltered.length) return null

  return (
    <>
      {appMessagesFiltered.map((message, i) => (
        <BannerContainer id={'message_' + i}>
          <h1>{message}</h1>
        </BannerContainer>
      ))}
    </>
  )
}
