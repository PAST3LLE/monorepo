import { ArticleFadeIn, ChevronLeft, ChevronRight, ColumnCenter, RowCenter, SpinnerCircle } from '@past3lle/components'
import { upToExtraSmall } from '@past3lle/theme'
import React from 'react'
import styled from 'styled-components'

import { ConnectionStatusCtrlState } from '../../../controllers/types/controllerTypes'
import { usePstlWeb3ModalStore } from '../../../hooks'
import { connectorOverridePropSelector } from '../../../utils/misc'
import { ModalText } from '../common/styled'

interface ConnectionError extends Error {
  code?: number
}

export function ConnectionApproval() {
  const {
    state: {
      modal: { error },
      connectionStatus: { ids: possibleIds, status },
      userOptions: {
        connectors: { overrides }
      }
    },
    callbacks: {
      open,
      error: { reset },
      connectionStatus: { retryConnection }
    }
  } = usePstlWeb3ModalStore()
  const connectorOverride = connectorOverridePropSelector(overrides, possibleIds)

  return (
    <ConnectionApprovalContainer>
      <ConnectorLabelAndLogoWrapper>
        <ColumnCenter gap="0.5rem">
          {!!connectorOverride?.logo && <img src={connectorOverride.logo} />}
          <ModalText modal="connection" node="header">
            {connectorOverride?.customName || possibleIds[0]}
          </ModalText>
        </ColumnCenter>
        <ColumnCenter gap="0.7rem" flex="1 1 330px">
          <ModalText
            modal="connection"
            node="header"
            fontSize={'1.75em'}
            lineHeight={'1'}
            color={status === 'error' ? '#f39c9c' : undefined}
          >
            {_getDerivedLabel(status, error).title}
          </ModalText>
          <ModalText modal="connection" node="subHeader" fontSize={'1.1em'} lineHeight={'1.2'} fontWeight={300}>
            {_getDerivedLabel(status, error)?.description}
          </ModalText>
          {status === 'loading' && <SpinnerCircle size={100} strokeWidth={0.7} />}
        </ColumnCenter>
      </ConnectorLabelAndLogoWrapper>
      {status !== 'loading' && (
        <FooterButtonsWrapper gap="0.25rem">
          <ModalText
            as={RowCenter}
            modal="connection"
            node="main"
            onClick={() => {
              reset()
              open({ route: 'ConnectWallet' })
            }}
            justifyContent="flex-start"
          >
            <ChevronLeft size={20} /> WALLETS
          </ModalText>
          <ModalText
            as={RowCenter}
            modal="connection"
            node="main"
            onClick={() => retryConnection()}
            justifyContent="flex-end"
          >
            RETRY <ChevronRight size={20} />
          </ModalText>
        </FooterButtonsWrapper>
      )}
    </ConnectionApprovalContainer>
  )
}

const ConnectorLabelAndLogoWrapper = styled(RowCenter)`
  > ${ColumnCenter}:last-child {
    > ${ModalText} {
      text-wrap: balance;
    }
  }

  ${upToExtraSmall`
    > ${ColumnCenter}:last-child {
      > ${ModalText} {
        text-align: center;
      }
    }
  `}
`
const FooterButtonsWrapper = styled(RowCenter)``

const ConnectionApprovalContainer = styled(ArticleFadeIn).attrs({ as: ColumnCenter })`
  justify-content: center;
  height: 100%;
  gap: 20%;
  z-index: 1;

  > ${ConnectorLabelAndLogoWrapper} {
    width: 90%;
    flex-flow: row wrap-reverse;
    gap: 1rem;
    > ${ColumnCenter}:first-child {
      max-width: 200px;
      > img {
        max-width: 60%;
      }
    }
  }
  > ${FooterButtonsWrapper} {
    width: 80%;
    > ${ModalText} {
      cursor: pointer;
      transition: text-decoration 200ms ease-in-out;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  ${upToExtraSmall`
    flex-flow: row wrap;
    align-items: flex-start;
    > ${ConnectorLabelAndLogoWrapper} {
      margin-top: 2rem;
    }
    
    > ${RowCenter}:first-child > ${ColumnCenter}:first-child {
      margin-bottom: auto;
      > img {
        max-width: 100px;
      }
    }
    > ${FooterButtonsWrapper} {
      width: 80%;
    }
  `}
`

function _getDerivedLabel(
  status: ConnectionStatusCtrlState['status'],
  error?: ConnectionError
): { title: string; description?: string } {
  switch (status) {
    case 'error':
      return _getErrorMessage(error)
    case 'loading':
      return { title: 'Approve connection' }
    case 'success':
      return { title: 'Connection successful!' }
    default:
    case 'idle':
      return { title: 'Please try again or go back to wallet selection.' }
  }
}

function _getErrorMessage(error?: ConnectionError) {
  switch (error?.code) {
    case -32002:
      return {
        title: 'Error! Connection already pending',
        description: 'Previous wallet connection pending. Check your wallet for a connection prompt.'
      }
    case 4001:
      return {
        title: 'Error! User rejected connection',
        description: 'User rejection detected. Either retry below or head back to wallets.'
      }
    default:
      return { title: 'Error!', description: error?.message }
  }
}
