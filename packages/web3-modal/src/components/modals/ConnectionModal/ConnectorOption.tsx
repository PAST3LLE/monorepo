import { ButtonProps, RowCenter } from '@past3lle/components'
import { ConnectArgs, ConnectResult, PublicClient } from '@wagmi/core'
import React, { ReactNode, memo } from 'react'
import { Chain } from 'viem'

import { ConnectorEnhanced } from '../../../types'
import { ConnectorInfo } from '../../../utils/connectConnector'
import { Tooltip } from '../common/Tooltip'
import { ModalButton } from '../common/styled'
import { ConnectorHelper } from './ConnectorHelper'
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
  connector: ConnectorEnhanced<any, any>
  modalView: 'list' | 'grid'
  logoStyleProps?: React.CSSProperties
  buttonProps?: ButtonProps
  helperContent?: ConnectorEnhanced<any, any>['infoText']
  showHelperText?: boolean
  logo: ReactNode
  callback?: Callback
}
function ConnectorOptionBase({
  id,
  className,
  optionType,
  optionValue,
  connector,
  label,
  isRecommended,
  logo,
  connected,
  helperContent,
  showHelperText,
  buttonProps = {},
  callback
}: ConnectorOptionProps) {
  const showTooltip = showHelperText && typeof helperContent?.content === 'string' && helperContent?.type === 'TOOLTIP'
  const showDropdown = showHelperText && !showTooltip && !!helperContent?.content
  return (
    <div className={className} option-type={optionType} option-value={optionValue} id={id}>
      <ModalButton modal="connection" node="main" onClick={callback} connected={connected} {...buttonProps}>
        {logo}
        <RowCenter>
          {label}
          {showTooltip && <Tooltip size={10} tooltip={helperContent.content as string} />}
        </RowCenter>
        {isRecommended && <RecommendedLabel />}
      </ModalButton>
      {showDropdown && (
        <ConnectorHelper title={helperContent?.title as string} connector={connector}>
          {helperContent?.content as ReactNode}
        </ConnectorHelper>
      )}
    </div>
  )
}

export const ConnectorOption = memo(ConnectorOptionBase)
