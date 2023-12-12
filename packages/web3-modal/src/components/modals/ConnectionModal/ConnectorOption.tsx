import { ButtonProps, ColumnCenter, RowCenter } from '@past3lle/components'
import { ConnectArgs, ConnectResult, PublicClient } from '@wagmi/core'
import React, { ReactNode, memo } from 'react'
import styled from 'styled-components'
import { Chain } from 'viem'

import { UserOptionsCtrlState } from '../../../controllers/types/controllerTypes'
import { ConnectorInfo } from '../../../utils/connectConnector'
import { ModalButton } from '../common/styled'
import { RecommendedLabel } from './RecommendedLabel'

export type Callback =
  | (() => Promise<Chain>)
  | ((options?: any) => Promise<void>)
  | ((args?: Partial<ConnectArgs> | undefined) => Promise<ConnectResult<PublicClient>>)
export type ConnectorOptionProps = Omit<ConnectorInfo, 'logo'> & {
  id?: string
  className?: string
  optionType?: string
  optionValue?: string | number
  modalView: UserOptionsCtrlState['ui']['walletsView']
  logoStyleProps?: React.CSSProperties
  buttonProps?: ButtonProps
  logo: ReactNode
  callback?: Callback
}
function ConnectorOptionBase({
  id,
  className,
  optionType,
  optionValue,
  label,
  isRecommended,
  logo,
  connected,
  buttonProps = {},
  callback
}: ConnectorOptionProps) {
  return (
    <ConnectorOptionWrapper className={className} option-type={optionType} option-value={optionValue} id={id}>
      <ModalButton modal="connection" node="main" onClick={callback} connected={connected} {...buttonProps}>
        {logo}
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
