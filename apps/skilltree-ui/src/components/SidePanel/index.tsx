import { SidePanelCssProps, StyledSidePanel } from './styleds'
import { Row, Text } from '@past3lle/components'
import { CursiveHeader } from 'components/Text'
import React, { ReactNode, useCallback } from 'react'
import { ArrowLeft } from 'react-feather'
import { useSidePanelAtom } from 'state/SidePanel'

export interface SidePanelProps {
  header: string
  children: ReactNode
  onDismiss?: (...args: any[]) => void
  styledProps?: SidePanelCssProps
}
export function SidePanel({ header, children, onDismiss, styledProps }: SidePanelProps) {
  const [panels, setPanelState] = useSidePanelAtom()

  const onDismissCallback = useCallback(() => {
    setPanelState(undefined)
    onDismiss?.()
  }, [onDismiss, setPanelState])

  return (
    <StyledSidePanel {...styledProps}>
      <div style={{ position: 'absolute', left: 15, top: 0 }}>
        <Row justifyContent={'space-evenly'} alignItems="center" gap="1rem">
          {panels.length > 1 && <ArrowLeft size={20} onClick={onDismissCallback} cursor="pointer" />}
          <Text.SubHeader fontWeight={200} fontSize={'0.8rem'}>
            {panels.slice().reverse().join(' > ')}
          </Text.SubHeader>
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
