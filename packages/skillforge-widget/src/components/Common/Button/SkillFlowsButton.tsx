import { ButtonProps, InfoCircle } from '@past3lle/components'
import React from 'react'
import styled from 'styled-components'

import { usePendingFlowsCount } from '../../../state/Flows'
import { useSidePanelWriteAtom } from '../../../state/SidePanel'
import { useGenericImageSrcSet } from '../../../theme/global'
import { CursiveMonoHeaderProps } from '../Text'
import { HeaderButton } from './common'

interface InventoryButtonProps {
  buttonProps?: ButtonProps
  capitalLetterProps?: CursiveMonoHeaderProps['capitalLetterProps']
  restWordProps?: CursiveMonoHeaderProps['restWordProps']
}

export function SkillFlowsButton(props: InventoryButtonProps) {
  const srcSet = useGenericImageSrcSet()
  const [, setPanel] = useSidePanelWriteAtom()

  const pendingFlows = usePendingFlowsCount()
  return (
    <Wrapper onClick={() => setPanel('FLOWS')}>
      {!!pendingFlows && <NotificationDot backgroundColor="#4def98" label={pendingFlows + ' pending'} />}
      <HeaderButton
        iconKey="transactions"
        bgImage={srcSet.EMPTY_SKILL_DDPX_URL_MAP}
        fullHeader="UPGRADES"
        shortHeader="UPGRADES"
        animate={!!pendingFlows}
        height="100%"
        {...props}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  height: 80%;
`
const NotificationDot = styled(InfoCircle)`
  &&&&& {
    position: absolute;
    bottom: -9px;
    right: -8px;
    z-index: 100;
    height: 22px;
    width: auto;
    border-radius: 5px;
    padding: 0 5px;
    > span {
      font-size: 12px;
    }
  }
`
