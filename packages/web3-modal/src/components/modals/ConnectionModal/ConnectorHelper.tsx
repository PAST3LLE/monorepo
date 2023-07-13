import { ChevronDown, ChevronUp, ColumnCenter } from '@past3lle/components'
import { useStateRef } from '@past3lle/hooks'
import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { Connector } from 'wagmi'

import { ConnectorEnhanced } from '../../../types'

const ConnectorHelperContainer = styled(ColumnCenter)<{ open: boolean; contentHeight?: number }>`
  cursor: pointer;
  color: ${({ theme }) => theme?.modals?.connection?.helpers?.color || 'ghostwhite'};
  > p {
    font-weight: 400;
    font-size: 0.55em;

    margin: 0 0 0 2em;
    width: 100%;

    &:first-child {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    &:last-child {
      margin: 1em;
      overflow: hidden;
      ${({ open, contentHeight = 0 }) =>
        open
          ? `
        height: ${contentHeight}px;
        margin: 0 0 0.5em 0;
      `
          : `
        height: 0px;
        margin: 0;
      `}
      transition: margin 0.6s ease-in-out, height 0.3s ease-in-out;
    }
    > span {
      display: block;
      margin-left: 1em;
    }
  }
`

export function ConnectorHelper({
  title = 'View more info',
  ...props
}: {
  title?: ReactNode
  children?: ReactNode
  color?: string
  connector?: Connector<any, any>
}) {
  const [open, setOpen] = useState(false)
  const handleClick = () => setOpen((state) => !state)
  const [height, setRef] = useStateRef<number | undefined>(undefined, (node: HTMLElement | null) => node?.offsetHeight)
  return (
    <ConnectorHelperContainer width="100%" textAlign="left" open={open} contentHeight={height}>
      <p onClick={handleClick}>
        {open ? <ChevronUp width={'1.2em'} /> : <ChevronDown width={'1.2em'} />} {title}
      </p>
      <p>
        <span ref={setRef}>{props.children || _getConnectorHelperText(props.connector)}</span>
      </p>
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
