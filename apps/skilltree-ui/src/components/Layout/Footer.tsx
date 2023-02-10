import { Web3InfoContainer } from './common'
import { Footer as PstlFooter, Row } from '@past3lle/components'
import { ThemedButton } from 'components/Button'
import { CursiveMonoHeader } from 'components/Text'
import { UserConnectionStats } from 'components/UserWeb3ConnectionStats'
import React, { useState } from 'react'
import { useSidePanelAtom } from 'state/SidePanel'
import styled from 'styled-components/macro'

export function Footer() {
  const [isOpen, setIsOpen] = useState(false)
  const [, openActivePanel] = useSidePanelAtom()
  return (
    <FooterContainer isOpen={isOpen} onClick={() => setIsOpen((state) => !state)}>
      <Web3InfoContainer>
        <Row margin="0.5rem" width="100%" height="52px" gap="1rem">
          <ThemedButton
            display="flex"
            alignItems="center"
            gap="0.25rem"
            height="100%"
            width="50%"
            withBgImage
            onClick={() => openActivePanel({ type: 'USER_STATS' })}
          >
            <CursiveMonoHeader
              text="SKILLPOINTS"
              capitalLetterProps={{ color: '#77c51b', fontSize: '2.4rem', zIndex: 3 }}
              restWordProps={{ color: '#ebebe9', fontSize: '1.6rem', fontWeight: 200, zIndex: -1 }}
            />
          </ThemedButton>
          <UserConnectionStats containerProps={{ height: '100%', width: '100%' }} fontSize={'1.2rem'} />
        </Row>
      </Web3InfoContainer>
    </FooterContainer>
  )
}

const FooterContainer = styled(PstlFooter)<{ isOpen?: boolean }>`
  ${({ isOpen }) =>
    isOpen
      ? ``
      : `
    overflow: hidden;
    height: 10px;
    
  `}
`
