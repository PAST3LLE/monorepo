import { Z_INDICES } from '@past3lle/constants'
import { fromMedium } from '@past3lle/theme'
import React, { ReactNode, useMemo, useState } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'

import { Button, ButtonVariations } from '../Button'
import { Row } from '../Layout'
import { Text as LayoutText } from '../Text'

const CookieSubHeader = styled(LayoutText.SubHeader)`
  color: ${({ theme }) => theme.products.aside.textColor};
`
const CookieSubDescription = styled(LayoutText.Black)`
  color: ${({ theme }) => theme.products.aside.textColor};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`

const CheckboxRow = styled(Row)``
const CookieFullText = styled(CookieSubDescription)``
const CookieCheckbox = styled.input.attrs((props) => ({
  type: 'checkbox',
  ...props
}))`
  cursor: pointer;
  z-index: ${Z_INDICES.BEHIND};
`
const CookiesText = styled(CookieSubDescription).attrs({
  margin: 0,
  backgroundColor: 'transparent'
})`
  gap: 1rem;
`
interface CookieStyles {
  $bg?: string
  $bgAlt?: string
  $checkbox?: string
  $cta?: string
  $text?: string
  $customCss?: string
}
const CookieContainer = styled.div<CookieStyles>`
  display: grid;
  grid-template-columns: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2rem;
  background-color: ${({ theme, $bg = theme.blackOpaque1 }) => $bg};
  z-index: ${Z_INDICES.COOKIE_BANNER};
  touch-action: none;
  height: 80vh;

  overflow: auto;

  input[type='checkbox'] {
    z-index: 999;
    position: relative;

    appearance: none;
    background-color: ${({ theme, $text = theme.offWhite }) => $text};
    margin: 0;
    font: inherit;
    color: currentColor;
    width: 1.15em;
    height: 1.15em;
    border: 0.15em solid currentColor;
    border-radius: 0.15em;
    transform: translateY(-0.075em);

    display: grid;
    place-content: center;

    &::before {
      content: '';
      width: 0.85em;
      height: 0.85em;
      transform: scale(0);
      transition: 120ms transform ease-in-out;
      box-shadow: ${({ $checkbox = '#713de4' }) => `inset 1em 1em ${$checkbox}`};
    }

    &:checked::before {
      transform: scale(1);
    }
  }

  > * {
    padding: 1rem 0;
    color: ${({ theme, $text = theme.offWhite }) => $text};
  }

  ${CookieSubHeader} {
    font-size: 2.8rem;
  }

  ${CookiesText}, ${CookieSubDescription} {
    font-size: 2rem;
  }

  ${CookieFullText} {
    background-color: ${({ theme, $bgAlt = theme.purple1 }) => $bgAlt};
  }

  ${CheckboxRow} {
    max-width: min-content;
    justify-self: center;
    padding: 4rem;

    > ${CookiesText} {
      flex: 0 1 22rem;
      justify-content: space-between;

      &#checkbox_essential {
        pointer-events: none;
      }
    }
  }

  ${fromMedium`
    height: 50vh;

    > ${CookieFullText} {
      font-size: 1.6vw;
    }

    ${CookieSubHeader} {
      font-size: 2.2vw;
    }

    ${CookiesText} {
      font-size: 1.2vw;
    }
  `}

  ${({ $customCss }) => $customCss && $customCss}
`

export interface CookieProps {
  storageKey: string
  message: string
  fullText: ReactNode
  css?: string
  theme?: CookieStyles
  onSaveAndClose?: () => void
  onAcceptAnalytics?: () => void
  onAcceptMarketing?: () => void
  onAcceptAdvertising?: () => void
}

export function CookieBanner(props: CookieProps) {
  const storage = localStorage.getItem(props.storageKey)
  const [isOpen, setBannerOpen] = useState(storage === null || !JSON.parse(storage).interacted)

  const [cookieState, setCookieState] = useState({
    interacted: false,
    analytics: false,
    marketing: false,
    advertising: false
  })

  const callbacks = useMemo(
    () => ({
      analytics: () => setCookieState((state) => ({ ...state, analytics: !state.analytics })),
      marketing: () => setCookieState((state) => ({ ...state, marketing: !state.marketing })),
      advertising: () => setCookieState((state) => ({ ...state, advertising: !state.advertising })),
      onDismiss: () => setBannerOpen(false),
      onSaveAndClose: () => {
        setCookieState((state) => {
          const next = { ...state, interacted: true }
          localStorage.setItem(props.storageKey, JSON.stringify(next))
          return next
        })
        // Close modal
        callbacks.onDismiss()
        // Call cookie actions callbacks
        cookieState.analytics && props.onAcceptAnalytics?.()
        cookieState.marketing && props.onAcceptMarketing?.()
        cookieState.advertising && props.onAcceptAdvertising?.()
        props.onSaveAndClose?.()
      }
    }),
    [cookieState.advertising, cookieState.analytics, cookieState.marketing, props]
  )

  return isOpen ? (
    <CookieContainer
      $bg={props?.theme?.$bg}
      $bgAlt={props?.theme?.$bgAlt}
      $text={props?.theme?.$text}
      $customCss={props.css}
    >
      <Row height="4rem" width="100%" justifyContent={'space-between'} margin="0" padding="0">
        <CookieSubHeader padding={0} margin={0} fontWeight={500}>
          {props.message}
        </CookieSubHeader>
        <X size={32} onClick={callbacks.onSaveAndClose} cursor="pointer" color={props?.theme?.$text} />
      </Row>
      <CookieFullText margin="0" padding="1rem 2rem" fontWeight={300} overflow="auto" alignItems="center">
        {props.fullText}
      </CookieFullText>
      <CheckboxRow
        gap="1rem"
        flexWrap={'wrap'}
        alignItems="center"
        justifyContent={'space-evenly'}
        margin="0"
        padding="0"
      >
        <CookiesText id="checkbox_essential">
          ESSENTIALS
          <CookieCheckbox value="ESSENTIALS" defaultChecked disabled />
        </CookiesText>
        {props.onAcceptAnalytics && (
          <CookiesText>
            ANALYTICS
            <CookieCheckbox value="ANALYTICS" checked={cookieState.analytics} onChange={callbacks.analytics} />
          </CookiesText>
        )}
        {props.onAcceptMarketing && (
          <CookiesText>
            MARKETING
            <CookieCheckbox value="MARKETING" checked={cookieState.marketing} onChange={callbacks.marketing} />
          </CookiesText>
        )}
        {props.onAcceptAdvertising && (
          <CookiesText>
            ADVERTISING
            <CookieCheckbox value="ADVERTISING" checked={cookieState.advertising} onChange={callbacks.advertising} />
          </CookiesText>
        )}
      </CheckboxRow>
      <Button
        variant={ButtonVariations.SECONDARY}
        backgroundColor={props?.theme?.$cta}
        onClick={callbacks.onSaveAndClose}
        margin="0"
        padding="0"
      >
        <CookiesText justifyContent={'center'} padding="0.2rem">
          SAVE AND CLOSE
        </CookiesText>
      </Button>
    </CookieContainer>
  ) : null
}
