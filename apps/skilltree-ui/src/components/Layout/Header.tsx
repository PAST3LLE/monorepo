import { AutoRow, ExternalLink, Header as HeaderPstl, Pastellecon, Row } from '@past3lle/components'
import { upToSmall } from '@past3lle/theme'
import { ThemedButton } from 'components/Button'
import { BlackBoldItalic, BlackHeader, CursiveMonoHeader } from 'components/Text'
import { UserConnectionStats } from 'components/UserWeb3ConnectionStats'
import { SHOP_URL } from 'constants/index'
import React, { useState } from 'react'
import styled from 'styled-components/macro'

export const Skilltreecon = styled(Pastellecon)`
  filter: invert(1);
  margin-bottom: -25px;
  z-index: -1;
  transform: rotate(-11deg);
  position: absolute;
  top: -16px;
  left: -20px;
  width: 70%;
`

const LogoHeader = styled(BlackHeader)`
  position: relative;
  z-index: 1;
  color: ghostwhite;
  text-shadow: 4px 2px 3px #00000091;
`

export const CheckoutForge = ({ className }: { className?: string }) => (
  <AutoRow
    className={className}
    display={'inline-flex'}
    backgroundColor={'ghostwhite'}
    padding={'1rem'}
    marginRight="auto"
  >
    <BlackBoldItalic fontSize={'1.5rem'}>
      CHECK OUT THE{' '}
      <ExternalLink color="red" href={SHOP_URL}>
        THE FORGE
      </ExternalLink>{' '}
    </BlackBoldItalic>
  </AutoRow>
)

const Web3InfoContainer = styled(Row)<{ isOpen: boolean }>`
  position: relative;
  justify-content: flex-end;
  width: auto;
  gap: 1rem;

  > #Web3InfoContainer-close-button,
  #Web3InfoContainer-menu {
    display: none;
  }

  ${({ isOpen, theme }) => upToSmall`
    overflow: hidden;
    
    > ${ThemedButton} {
      display: none;
    }

    > #Web3InfoContainer-menu {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0; bottom: 0; left: 0; right: 0;
      background-color: ${theme.rarity.legendary.backgroundColor};
      font-family: 'Goth', monospace;
      font-size: 3rem;
      z-index: 500;
      border-radius: 5px;
      padding: 0.5rem;
    }
    
    // transition: width, height 0.4s ease-in-out;
    
    ${
      isOpen &&
      `
      background-color: ${theme.blackOpaque1};
      position: fixed;
      top: 8rem;
      right: 0;
      width: 300px;
      height: 200px;
      padding: 4rem;

      flex-flow: column nowrap;
      justify-content: space-evenly;
      align-items: center;

      > ${ThemedButton} {
        display: flex;
        color: black;
      }

      > #Web3InfoContainer-close-button {
        display: flex;
        position: absolute;
        top: 1rem;
        right: 1.5rem;
        color: ghostwhite;
        font-size: 2rem;
      }
      > #Web3InfoContainer-menu {
        display: none;
        font-size: 2rem;
      }
    `
    }
  `}
`

const HeaderContainer = styled(HeaderPstl)``

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <HeaderContainer>
      <Row gap="1rem" height="100%" justifyContent={'space-between'}>
        <LogoHeader>
          <Skilltreecon /> SKILLTREE
        </LogoHeader>
        <Web3InfoContainer isOpen={isOpen}>
          <span id="Web3InfoContainer-close-button" onClick={(e) => (e.stopPropagation(), setIsOpen(false))}>
            x
          </span>
          <Row margin="0.5rem" width="auto" height="52px" gap="1rem">
            <ThemedButton display="flex" alignItems="center" gap="0.25rem" height="100%" withBgImage>
              <CursiveMonoHeader
                text="View Stats"
                capitalLetterProps={{ color: '#77c51b', fontSize: '3rem' }}
                restWordProps={{ color: '#ebebe9', fontSize: '2rem' }}
              />
            </ThemedButton>
            <UserConnectionStats containerProps={{ height: '100%' }} />
          </Row>
          {/* <CheckoutForge /> */}

          <div id="Web3InfoContainer-menu" onClick={(e) => (e.stopPropagation(), setIsOpen(true))}>
            OPEN MENU
          </div>
        </Web3InfoContainer>
      </Row>
    </HeaderContainer>
  )
}
