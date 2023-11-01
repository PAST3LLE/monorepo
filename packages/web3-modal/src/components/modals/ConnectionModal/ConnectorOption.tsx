import { ButtonProps } from '@past3lle/components'
import { ConnectArgs, ConnectResult, PublicClient } from '@wagmi/core'
import React, { ReactNode, memo } from 'react'
import { Chain } from 'viem'

import { ConnectorEnhanced } from '../../../types'
import { ConnectorInfo } from '../../../utils/connectConnector'
import { ModalButton } from '../common/styled'
import { ConnectorHelper } from './ConnectorHelper'
import { RecommendedLabel } from './RecommendedLabel'

export type ConnectorOptionProps = Omit<ConnectorInfo, 'logo'> & {
  id?: string
  optionType?: string
  optionValue?: string | number
  connector: ConnectorEnhanced<any, any>
  modalView: 'list' | 'grid'
  logoStyleProps?: React.CSSProperties
  buttonProps?: ButtonProps
  helperContent?: ConnectorEnhanced<any, any>['infoText']
  showHelperText?: boolean
  logo: ReactNode
  callback?:
    | (() => Promise<Chain>)
    | ((options?: any) => Promise<void>)
    | ((args?: Partial<ConnectArgs> | undefined) => Promise<ConnectResult<PublicClient>>)
}
function ConnectorOptionBase({
  id,
  optionType,
  optionValue,
  connector,
  label,
  isRecommended,
  logo,
  connected,
  modalView,
  helperContent,
  showHelperText,
  buttonProps = {},
  callback
}: ConnectorOptionProps) {
  return (
    <div option-type={optionType} option-value={optionValue} id={id}>
      <ModalButton onClick={callback} connected={connected} {...buttonProps}>
        {logo}
        {label}
        {isRecommended && <RecommendedLabel />}
      </ModalButton>
      {modalView !== 'grid' && showHelperText && !!helperContent?.content && (
        <ConnectorHelper title={helperContent.title} connector={connector}>
          {helperContent.content}
        </ConnectorHelper>
      )}
    </div>
  )
}

export const ConnectorOption = memo(ConnectorOptionBase)
