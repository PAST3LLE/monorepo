import { useInterval, useStateRef } from '@past3lle/hooks'
import { Placement } from '@popperjs/core'
import React, { useCallback } from 'react'
import { usePopper } from 'react-popper'

import { Portal } from '../Portal'
import { Arrow, PopoverContainer, ReferenceElement } from './styleds'

export interface PopoverProps {
  content: React.ReactNode
  show: boolean
  children: React.ReactNode
  placement?: Placement
  styles?: React.CSSProperties
}

export function Popover({ content, show, children, placement = 'auto', styles }: PopoverProps) {
  const [referenceElement, setReferenceElement] = useStateRef<HTMLDivElement | null>(null, (node) => node)
  const [popperElement, setPopperElement] = useStateRef<HTMLDivElement | null>(null, (node) => node)
  const [arrowElement, setArrowElement] = useStateRef<HTMLDivElement | null>(null, (node) => node)
  const {
    styles: pStyles,
    update,
    attributes
  } = usePopper(referenceElement, popperElement, {
    placement,
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [8, 8] } },
      { name: 'arrow', options: { element: arrowElement } }
    ]
  })
  const updateCallback = useCallback(() => {
    update && update()
  }, [update])
  useInterval(updateCallback, show ? 100 : null)

  return (
    <>
      <ReferenceElement ref={setReferenceElement}>{children}</ReferenceElement>
      <Portal>
        <PopoverContainer
          show={show}
          ref={setPopperElement}
          style={{ ...pStyles.popper, ...styles }}
          {...attributes.popper}
        >
          {content}
          <Arrow
            className={`arrow-${attributes.popper?.['data-popper-placement'] ?? ''}`}
            ref={setArrowElement}
            style={{ ...pStyles.arrow, backgroundColor: styles?.backgroundColor }}
            {...attributes.arrow}
          />
        </PopoverContainer>
      </Portal>
    </>
  )
}
