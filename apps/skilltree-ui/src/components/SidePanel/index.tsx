import { SidePanelCssProps, StyledSidePanel } from './styleds'
import { Row } from '@past3lle/components'
import { CursiveHeader } from 'components/Text'
import React, { ReactNode, useCallback } from 'react'
import { useSidePanelAtom } from 'state/SidePanel'

export interface SidePanelProps {
  header: string
  children: ReactNode
  onDismiss?: (...args: any[]) => void
  styledProps?: SidePanelCssProps
}
export function SidePanel({ header, children, onDismiss, styledProps }: SidePanelProps) {
  const [, setPanelState] = useSidePanelAtom()

  const onDismissCallback = useCallback(() => {
    setPanelState({ type: undefined })
    onDismiss?.()
  }, [onDismiss, setPanelState])

  return (
    <StyledSidePanel {...styledProps}>
      <div
        onClick={onDismissCallback}
        style={{ position: 'absolute', right: 15, top: 10, fontWeight: 300, fontSize: '3rem', cursor: 'pointer' }}
      >
        x
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
