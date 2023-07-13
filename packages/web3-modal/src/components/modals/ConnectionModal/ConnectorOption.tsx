import { ButtonProps } from '@past3lle/components'
import { ConnectArgs, ConnectResult, PublicClient } from '@wagmi/core'
import React, { memo } from 'react'

import { ConnectorEnhanced } from '../../../types'
import { ConnectorInfo } from '../../../utils'
import { ModalButton } from '../common/styled'
// import { ConnectedCheckMark } from './ConnectedCheckMark'
import { ConnectorHelper } from './ConnectorHelper'
import { RecommendedLabel } from './RecommendedLabel'

export type ConnectorOptionProps = ConnectorInfo & {
  connector: ConnectorEnhanced<any, any>
  modalView: 'list' | 'grid'
  buttonProps?: ButtonProps
  helperContent?: ConnectorEnhanced<any, any>['infoText']
  showHelperText?: boolean
  callback?:
    | ((options?: any) => Promise<void>)
    | ((args?: Partial<ConnectArgs> | undefined) => Promise<ConnectResult<PublicClient>>)
}
function ConnectorOptionBase({
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
    <>
      <ModalButton onClick={callback} connected={connected} {...buttonProps}>
        <img src={logo} />
        {label}
        {/* {connected && <ConnectedCheckMark />} */}
        {isRecommended && <RecommendedLabel />}
      </ModalButton>
      {modalView !== 'grid' && showHelperText && !!helperContent?.content && (
        <ConnectorHelper title={helperContent.title} connector={connector}>
          {helperContent.content}
        </ConnectorHelper>
      )}
    </>
  )
}

export const ConnectorOption = memo(ConnectorOptionBase)
