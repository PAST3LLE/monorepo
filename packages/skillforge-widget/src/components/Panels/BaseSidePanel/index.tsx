import { ArrowLeft, Row } from '@past3lle/components'
import { useOnClickOutside, useOnKeyPress } from '@past3lle/hooks'
import React, { ReactNode, useCallback, useRef } from 'react'

import { useSidePanelAtomBase } from '../../../state/SidePanel'
import { CursiveHeader } from '../../Common/Text'
import { SidePanelCssProps, StyledSidePanel } from './styleds'

export interface SidePanelProps {
  header: string
  children: ReactNode
  onDismiss?: (...args: any[]) => void
  onBack?: (...args: any[]) => void
  styledProps?: SidePanelCssProps
  options?: {
    onClickOutsideConditionalCb?: (node: Node) => boolean
  }
}

export function SidePanel({ header, children, onBack, onDismiss, options, styledProps }: SidePanelProps) {
  const [{ type: panels }, setPanelState] = useSidePanelAtomBase()

  const onBackCallback = useCallback(() => {
    setPanelState((state) => ({ ...state, type: state.type.slice(1) }))
    onBack?.()
  }, [onBack, setPanelState])

  const onDismissCallback = useCallback(() => {
    setPanelState({ type: [] })
    onDismiss?.()
  }, [onDismiss, setPanelState])

  const ref = useRef(null)
  useOnClickOutside(ref, onDismissCallback, options?.onClickOutsideConditionalCb)

  useOnKeyPress(['Escape', 'Esc'], onDismissCallback)

  return (
    <StyledSidePanel {...styledProps} ref={ref}>
      <div id="bg-tag" />
      <div style={{ position: 'absolute', left: 15, top: '6.25rem' }}>
        <Row justifyContent={'space-evenly'} alignItems="center" gap="1rem">
          {panels.length > 1 && onBack && <ArrowLeft size={20} onClick={onBackCallback} cursor="pointer" />}
        </Row>
      </div>
      {onDismiss && (
        <div
          onClick={onDismissCallback}
          style={{
            position: 'absolute',
            right: 15,
            top: '0.5rem',
            fontWeight: 300,
            fontSize: '3rem',
            cursor: 'pointer'
          }}
        >
          <span>x</span>
        </div>
      )}
      <Row>
        <CursiveHeader marginBottom="2rem" justifyContent={'center'}>
          {header}
        </CursiveHeader>
      </Row>
      {children}
    </StyledSidePanel>
  )
}
