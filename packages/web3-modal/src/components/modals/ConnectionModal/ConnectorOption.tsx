import { ButtonProps, ColumnCenter, RowCenter } from '@past3lle/components'
import React, { ReactNode, memo } from 'react'
import styled from 'styled-components'
import { Chain } from 'viem'
import { UseConnectReturnType } from 'wagmi'

import { UserOptionsCtrlState } from '../../../controllers/types'
import { ConnectorInfo } from '../../../utils/connectConnector'
import { ModalButton } from '../common/styled'
import { RecommendedLabel } from './RecommendedLabel'

export type Callback =
  | (() => Promise<Chain>)
  | ((options?: any) => Promise<void>)
  | UseConnectReturnType['connectAsync']
  | UseConnectReturnType['connect']
export type ConnectorOptionProps = Omit<ConnectorInfo, 'icon'> & {
  id?: string
  className?: string
  optionType?: string
  optionValue?: string | number
  modalView: UserOptionsCtrlState['ui']['walletsView']
  logoStyleProps?: React.CSSProperties
  buttonProps?: ButtonProps
  icon: ReactNode
  disabled?: boolean
  callback?: Callback
}
function ConnectorOptionBase({
  id,
  className,
  optionType,
  optionValue,
  label,
  isRecommended,
  icon,
  connected,
  buttonProps = {},
  disabled = false,
  callback
}: ConnectorOptionProps) {
  return (
    <ConnectorOptionWrapper className={className} option-type={optionType} option-value={optionValue} id={id}>
      <ModalButton
        modal="connection"
        node="main"
        disabled={disabled}
        onClick={callback}
        connected={connected}
        {...buttonProps}
      >
        {icon}
        <RowCenter>{label}</RowCenter>
        {isRecommended && <RecommendedLabel />}
      </ModalButton>
    </ConnectorOptionWrapper>
  )
}

const ConnectorOptionWrapper = styled(ColumnCenter)`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`

export const ConnectorOption = memo(ConnectorOptionBase)
