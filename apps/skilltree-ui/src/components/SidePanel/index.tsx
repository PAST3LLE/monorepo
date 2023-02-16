import { SidePanelCssProps, StyledSidePanel } from './styleds'
import { Row } from '@past3lle/components'
import { CursiveHeader } from 'components/Text'
import React, { ReactNode, useCallback } from 'react'
import { ArrowLeft } from 'react-feather'
import {
  /* useSidePanelAtom, */
  useSidePanelAtomBase
} from 'state/SidePanel'

export interface SidePanelProps {
  header: string
  children: ReactNode
  onDismiss?: (...args: any[]) => void
  onBack?: (...args: any[]) => void
  styledProps?: SidePanelCssProps
}
export function SidePanel({ header, children, onBack, onDismiss, styledProps }: SidePanelProps) {
  const [{ type: panels }, setPanelState] = useSidePanelAtomBase()

  const onBackCallback = useCallback(() => {
    setPanelState((state) => ({ ...state, type: state.type.slice(1) }))
    onBack?.()
  }, [onBack, setPanelState])

  const onDismissCallback = useCallback(() => {
    setPanelState({ type: [] })
    onDismiss?.()
  }, [onDismiss, setPanelState])

  return (
    <StyledSidePanel {...styledProps}>
      <div id="bg-tag" />
      <div style={{ position: 'absolute', left: 15, top: 20 }}>
        <Row justifyContent={'space-evenly'} alignItems="center" gap="1rem">
          {panels.length > 1 && <ArrowLeft size={20} onClick={onBackCallback} cursor="pointer" />}
        </Row>
      </div>
      <div
        onClick={onDismissCallback}
        style={{ position: 'absolute', right: 15, top: 10, fontWeight: 300, fontSize: '3rem', cursor: 'pointer' }}
      >
        <span>x</span>
      </div>
      <Row>
        <CursiveHeader marginBottom="4rem" justifyContent={'center'}>
          {header}
        </CursiveHeader>
      </Row>
      {children}
    </StyledSidePanel>
  )
}
