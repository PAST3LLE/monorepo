import { Web3InfoContainer } from './common'
import { Footer as PstlFooter, Row } from '@past3lle/components'
import { InventoryButton } from 'components/Button'
import { ConnectionInfoButton } from 'components/Button/ConnectionInfoButton'
import { FlashingText } from 'components/FlashingText'
// import { UserConnectionStats } from 'components/UserWeb3ConnectionStats'
import React, { useState } from 'react'
import styled from 'styled-components/macro'

export function Footer() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <FooterContainer isOpen={isOpen} onClick={() => setIsOpen((state) => !state)}>
      <FlashingText duration={3}>Tap to open</FlashingText>
      <Web3InfoContainer>
        <Row margin="0.5rem" width="100%" height="52px" gap="1rem">
          <InventoryButton
            buttonProps={{ width: '50%' }}
            capitalLetterProps={{ color: '#77c51b', fontSize: '2.4rem', zIndex: 3 }}
            restWordProps={{ color: '#ebebe9', fontSize: '1.6rem', fontWeight: 300, zIndex: -1 }}
          />
          {/* <UserConnectionStats containerProps={{ height: '100%', width: '100%' }} fontSize={'1.2rem'} /> */}
          <ConnectionInfoButton />
        </Row>
      </Web3InfoContainer>
    </FooterContainer>
  )
}

const FooterContainer = styled(PstlFooter)<{ isOpen?: boolean }>`
  ${({ isOpen }) =>
    isOpen
      ? `
      > ${FlashingText} {
        display: none;
      }
      `
      : `
    overflow: hidden;
    height: 30px;

    > ${FlashingText} {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: -2px auto auto;
      font-size: 2rem;
      font-weight: 300;
    }

    > ${Web3InfoContainer} {
      display: none;
    }
    
  `}
`
