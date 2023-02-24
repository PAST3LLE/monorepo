import React, { ReactNode, useMemo, useState } from 'react'
import { X } from 'react-feather'

import { Button, ButtonVariations } from '../Button'
import { ColumnCenter, Row } from '../Layout'
import * as styleds from './styleds'
import { CookieStyles } from './types'

const DEFAULT_COOKIE_STATE = {
  interacted: false,
  analytics: false,
  marketing: false,
  advertising: false
}
type CookieState = typeof DEFAULT_COOKIE_STATE
export interface CookieProps {
  storageKey: string
  message: string
  fullText: ReactNode
  css?: string
  theme?: CookieStyles
  onSaveAndClose?: (cookieState: CookieState) => void
  onAcceptAnalytics?: (cookieState: CookieState) => void
  onAcceptMarketing?: (cookieState: CookieState) => void
  onAcceptAdvertising?: (cookieState: CookieState) => void
}

export function CookieBanner(props: CookieProps) {
  const storage = localStorage.getItem(props.storageKey)
  const [isOpen, setBannerOpen] = useState(storage === null || !JSON.parse(storage).interacted)

  const [cookieState, setCookieState] = useState(DEFAULT_COOKIE_STATE)

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
          // Call cookie actions callbacks
          cookieState.analytics && props.onAcceptAnalytics?.(next)
          cookieState.marketing && props.onAcceptMarketing?.(next)
          cookieState.advertising && props.onAcceptAdvertising?.(next)
          props.onSaveAndClose?.(next)

          return next
        })

        // Close modal
        callbacks.onDismiss()
      }
    }),
    [cookieState, props]
  )

  return isOpen ? (
    <styleds.CookieContainer
      $bg={props?.theme?.$bg}
      $bgAlt={props?.theme?.$bgAlt}
      $text={props?.theme?.$text}
      $customCss={props.css}
    >
      <ColumnCenter>
        <Row height={40} width="100%" justifyContent="space-between" margin="0" padding="0">
          <styleds.CookieSubHeader padding={0} margin={0} fontWeight={500}>
            {props.message}
          </styleds.CookieSubHeader>
          <X size={32} onClick={callbacks.onSaveAndClose} cursor="pointer" color={props?.theme?.$text} />
        </Row>
        <styleds.CookieFullText
          margin="0"
          padding={40}
          fontWeight={300}
          overflow="auto"
          alignItems="start"
          justifyContent="center"
        >
          {props.fullText}
        </styleds.CookieFullText>
        <styleds.CheckboxRow
          width="75%"
          gap="10px 30px"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="center"
          margin="0"
        >
          <styleds.CookiesText id="checkbox_essential">
            ESSENTIALS
            <styleds.CookieCheckbox value="ESSENTIALS" defaultChecked disabled />
          </styleds.CookiesText>
          {props.onAcceptAnalytics && (
            <styleds.CookiesText>
              ANALYTICS
              <styleds.CookieCheckbox
                value="ANALYTICS"
                checked={cookieState.analytics}
                onChange={callbacks.analytics}
              />
            </styleds.CookiesText>
          )}
          {props.onAcceptMarketing && (
            <styleds.CookiesText>
              MARKETING
              <styleds.CookieCheckbox
                value="MARKETING"
                checked={cookieState.marketing}
                onChange={callbacks.marketing}
              />
            </styleds.CookiesText>
          )}
          {props.onAcceptAdvertising && (
            <styleds.CookiesText>
              ADVERTISING
              <styleds.CookieCheckbox
                value="ADVERTISING"
                checked={cookieState.advertising}
                onChange={callbacks.advertising}
              />
            </styleds.CookiesText>
          )}
        </styleds.CheckboxRow>
        <Button
          variant={ButtonVariations.SECONDARY}
          backgroundColor={props?.theme?.$cta}
          onClick={callbacks.onSaveAndClose}
          margin="0"
          padding="20px 40px"
        >
          <styleds.CookiesText justifyContent={'center'} padding="0.2rem">
            SAVE AND CLOSE
          </styleds.CookiesText>
        </Button>
      </ColumnCenter>
    </styleds.CookieContainer>
  ) : null
}
