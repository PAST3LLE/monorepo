import { ButtonProps, InfoCircle } from '@past3lle/components'
import { usePendingTransactions, usePstlWeb3Modal } from '@past3lle/web3-modal'
import React from 'react'
import styled from 'styled-components'

import { useGenericImageSrcSet } from '../../../theme/global'
import { CursiveMonoHeaderProps } from '../Text'
import { HeaderButton } from './common'

interface InventoryButtonProps {
  buttonProps?: ButtonProps
  capitalLetterProps?: CursiveMonoHeaderProps['capitalLetterProps']
  restWordProps?: CursiveMonoHeaderProps['restWordProps']
}

export function TxHistoryButton(props: InventoryButtonProps) {
  const srcSet = useGenericImageSrcSet()
  const { open } = usePstlWeb3Modal()

  const { length } = usePendingTransactions()
  return (
    <Wrapper onClick={() => open({ route: 'Transactions' })}>
      {!!length && <NotificationDot backgroundColor="#4def98" label={length.toString() + ' pending'} />}
      <HeaderButton
        iconKey="transactions"
        bgImage={srcSet.EMPTY_SKILL_DDPX_URL_MAP}
        fullHeader={'Transactions'}
        shortHeader="TXs"
        animate={!!length}
        height="100%"
        {...props}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  height: 100%;
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
