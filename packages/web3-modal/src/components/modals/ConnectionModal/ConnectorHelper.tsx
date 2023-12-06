import { ColumnCenter } from '@past3lle/components'
import { useStateRef } from '@past3lle/hooks'
import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { Connector } from 'wagmi'

import { ConnectorEnhanced } from '../../../types'
import { ModalText } from '../common/styled'

const ConnectorHelperContainer = styled(ColumnCenter)<{ open: boolean; contentHeight?: number }>`
  cursor: pointer;
  color: ${({ theme }) => theme?.modals?.base?.helpers?.font?.color};
  font-size: ${({ theme }) => theme?.modals?.base?.helpers?.font?.size};
  > ${ModalText} {
    flex-flow: column nowrap;
    justify-content: flex-start;
    background-color: ${(props) => props.theme.modals?.base?.background?.success};
    font-weight: 400;
    width: 93%;
    text-decoration: underline;

    transition: border-radius 1s ease-in-out;

    &:first-child {
      display: flex;
      align-items: center;
      gap: 0.3rem;

      border-radius: 0 0 10px 10px;
      padding: 1px 1rem;
      overflow: hidden;

      ${({ open }) =>
        open
          ? `
        overflow-y: auto;
        text-decoration: unset;
        padding: 5px 1rem 0.3rem;
        height: 80px;
      `
          : `
        height: 20px;
      `}

      transition: padding 0.6s ease-in-out, margin 0.6s ease-in-out, height 0.3s ease-in-out;
    }
    > span {
      display: block;
    }
  }
`

export function ConnectorHelper({
  title = 'View more info',
  ...props
}: {
  title?: ReactNode
  className?: string
  children?: ReactNode
  color?: string
  connector?: Connector<any, any>
}) {
  const [open, setOpen] = useState(false)
  const handleClick = () => setOpen((state) => !state)
  const [height = 0, setRef] = useStateRef<number | undefined>(
    undefined,
    (node: HTMLElement | null) => node?.offsetHeight
  )
  return (
    <ConnectorHelperContainer
      className={props?.className}
      width="100%"
      textAlign="left"
      open={open}
      contentHeight={height + 10}
      onClick={handleClick}
    >
      <ModalText modal="base" node="main">
        {title}
        <span ref={setRef}>{props.children || _getConnectorHelperText(props.connector)}</span>
      </ModalText>
    </ConnectorHelperContainer>
  )
}

function _getConnectorHelperText(connector?: ConnectorEnhanced<any, any>) {
  switch (connector?.id) {
    case 'web3auth':
      return (
        connector?.details ||
        'Web3Auth is a non-custodial (non-owning) social login wallet that makes it easy for users to log-in to dApps (decentralised apps) via familiar social login methods.'
      )

    case 'walletConnect':
      return (
        connector?.details ||
        'Web3Modal/WalletConnect is a blockchain wallet aggregator making it easy for users to select their favourite wallet with which to connect to dApps (decentralised apps). This generally requires more blockchain knowledge.'
      )
    default:
      return connector?.details || null
  }
}
