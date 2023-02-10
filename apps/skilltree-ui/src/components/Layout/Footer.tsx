import { Web3InfoContainer } from './common'
import { Footer as PstlFooter, Row } from '@past3lle/components'
import { ThemedButton } from 'components/Button'
import { CursiveMonoHeader } from 'components/Text'
import { UserConnectionStats } from 'components/UserWeb3ConnectionStats'
import React from 'react'
import { useSidePanelAtom } from 'state/SidePanel'

export function Footer() {
  const [, openActivePanel] = useSidePanelAtom()
  return (
    <PstlFooter>
      <Web3InfoContainer>
        <Row margin="0.5rem" width="auto" height="52px" gap="1rem">
          <ThemedButton
            display="flex"
            alignItems="center"
            gap="0.25rem"
            height="100%"
            withBgImage
            onClick={() => openActivePanel({ type: 'USER_STATS' })}
          >
            <CursiveMonoHeader
              text="SKILLPOINTS"
              capitalLetterProps={{ color: '#77c51b', fontSize: '3rem', zIndex: 3 }}
              restWordProps={{ color: '#ebebe9', fontSize: '2.2rem', fontWeight: 200, zIndex: -1 }}
            />
          </ThemedButton>
          <UserConnectionStats containerProps={{ height: '100%' }} />
        </Row>
      </Web3InfoContainer>
    </PstlFooter>
  )
}
