import { Web3InfoContainer } from '../common'
import { ExternalLink, Header as PstlHeader, Pastellecon, Row } from '@past3lle/components'
import { upToSmall } from '@past3lle/theme'
import MENU_BUTTON from 'assets/png/menu-button.png'
import { BlackHeader, BlackBoldItalic, CursiveHeader } from 'components/Text'
import { SHOP_URL } from 'constants/urls'
import React from 'react'
import styled from 'styled-components/macro'
import { MAIN_BG } from 'theme/constants'

export const Skilltreecon = styled(Pastellecon)`
  filter: invert(1);
  margin-bottom: -25px;
  z-index: -1;
  transform: rotate(-11deg);
  position: absolute;
  top: -23px;
  left: -8px;
  width: 70%;
`

export const LogoHeader = styled(BlackHeader)`
  position: relative;
  z-index: 1;
  color: ghostwhite;
  text-shadow: 4px 2px 3px #00000091;
  max-width: 27rem;
`

export const CheckoutForge = ({ className }: { className?: string }) => (
  <Row
    className={className}
    color={MAIN_BG}
    backgroundColor={'black'}
    padding={'0.75rem 1rem'}
    width="13.5rem"
    justifyContent={'center'}
  >
    <BlackBoldItalic fontSize={'1.5rem'} fontWeight={500} fontFamily="monospace">
      {/* @ts-ignore */}
      <ExternalLink $color={MAIN_BG} href={SHOP_URL} style={{ letterSpacing: '-1.6px' }}>
        view shop
      </ExternalLink>
    </BlackBoldItalic>
  </Row>
)

export const HeaderContainer = styled(PstlHeader)<{ isOpen?: boolean }>`
  min-height: 8rem;
  height: auto;
  padding: 1.5rem 2.5rem 0;

  > ${Row} {
    > ${LogoHeader} {
      > ${Skilltreecon} {
        width: 30%;
        opacity: 0.82;
      }
    }
    > ${Web3InfoContainer} {
      display: flex;
      > ${Row} {
        margin: 0.5rem;
        width: auto;
        height: 52px;
        gap: 0 2rem;
      }
    }
  }

  ${({ isOpen }) => upToSmall`
    min-height: 6rem;
    padding: 0;

  > ${Row} > ${LogoHeader} {
    width: 100%;
    padding: 0.5rem;
    margin-left: 1rem;

    > ${Skilltreecon} {
      display: none;
    }
    > ${Row} {
      display: inline-flex;
      width: 100%;
      margin-left: 0rem;

      ${CursiveHeader} {
        width: auto;
        font-size: 5rem;
      }
      > div:last-child {
        z-index: -1;
        width: auto;
      }
    }
  }

    > ${Row} > ${Web3InfoContainer} {
      // display: none;
      width: 45px;
      height: 45px;
      margin-right: 1rem;
      background: url(${MENU_BUTTON}) center/cover no-repeat;

      > ${Row} {
        ${!isOpen && 'display: none;'}
        overflow: hidden;
      }
    }
  `}
`
