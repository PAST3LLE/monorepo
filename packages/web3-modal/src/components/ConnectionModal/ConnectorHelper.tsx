import { ColumnCenter } from '@past3lle/components'
import { useStateRef } from '@past3lle/hooks'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Connector } from 'wagmi'

const ConnectorHelperContainer = styled(ColumnCenter)<{ open: boolean; contentHeight?: number }>`
  overflow: hidden;
  cursor: pointer;
  color: ${({ theme }) => theme.modals?.connection?.helpers?.color || 'ghostwhite'};
  > p {
    font-size: 0.55em;
    margin: 0 0 0 2em;
    width: 100%;
    &:last-child {
      margin: 1em;
      overflow: hidden;
      ${({ open, contentHeight = 0 }) =>
        open
          ? `
      height: ${contentHeight}px;
      margin: 1em 0;
      `
          : `
      height: 0px;
      margin: 0;
      `}
      transition: margin 0.6s ease-in-out, height 0.3s ease-in-out;
    }
  }
`

export function ConnectorHelper(props: { color?: string; connector: Connector<any, any, any> }) {
  const [open, setOpen] = useState(false)
  const handleClick = () => setOpen((state) => !state)
  const [height, setRef] = useStateRef<number | undefined>(undefined, (node: HTMLElement | null) => node?.offsetHeight)
  return (
    <ConnectorHelperContainer width="100%" textAlign="left" open={open} contentHeight={height}>
      <p onClick={handleClick}>
        [{open ? '-' : '+'}] What is {props.connector?.name || 'this'}?
      </p>
      <p>
        <span ref={setRef}>{_getConnectorHelperText(props.connector)}</span>
      </p>
    </ConnectorHelperContainer>
  )
}

function _getConnectorHelperText(connector: Connector<any, any, any>) {
  switch (connector.id) {
    case 'web3auth':
      return 'Web3Auth is a non-custodial (non-owning) social login wallet that makes it easy for users to log-in to dApps (decentralised apps) via familiar social login methods.'

    case 'walletConnect':
      return 'Web3Modal/WalletConnect is a blockchain wallet aggregator making it easy for users to select their favourite wallet with which to connect to dApps (decentralised apps). This generally requires more blockchain knowledge.'
    default:
      return null
  }
}
