import COLLECTIONS_MANAGER_NETWORKS from '../../forge-networks.json'
import { Column, Row } from '@past3lle/components'
import { SupportedChains } from '@past3lle/skillforge-web3'
import MERGE_MANAGER_NETWORKS from '@past3lle/skilltree-contracts/networks.json'
import MERGE_MANAGER_VERSION from '@past3lle/skilltree-contracts/package.json'
import React from 'react'
import styled from 'styled-components/macro'
import { Address } from 'wagmi'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../../package.json')

const AppVersionContainer = styled(Column)`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0.5rem 1rem 0.75rem;
  width: 100%;
  gap: 0.15rem;
  opacity: 0.4;
  background: #d5fb73;

  &:hover {
    opacity: 1;
  }

  transition: opacity 0.3s ease-in-out;

  > ${Column} {
    gap: 0.15rem;
    justify-content: center;
    align-items: flex-start;

    > ${Row} {
      gap: 0.5rem;
      width: auto;
      cursor: pointer;
      > a {
        color: inherit;
      }
    }

    &:hover {
      font-weight: 800;
    }
  }
`

export function AppVersion() {
  return (
    <AppVersionContainer>
      <Column>
        <Row>
          <strong>Version:</strong>
          <a
            href="https://github.com/PAST3LLE/monorepo/tree/main/apps/skillforge-ui/package.json"
            target="_blank noreferrer"
          >
            {packageJson?.version || 'Unknown version'}
          </a>
        </Row>
        <Row>
          <strong>Contracts: </strong>
          <a href="https://github.com/PAST3LLE/skilltree-contracts/tree/main/package.json" target="_blank noreferrer">
            {MERGE_MANAGER_VERSION?.version || 'Unknown version'}
          </a>
        </Row>
        <Row>
          <strong>CollectionsManager:</strong>{' '}
          <a
            href="https://github.com/PAST3LLE/skilltree-contracts/tree/main/contracts/CollectionsManager.sol"
            target="_blank noreferrer"
          >
            {COLLECTIONS_MANAGER_NETWORKS[SupportedChains.GOERLI].CollectionsManager.address as Address}
          </a>
        </Row>
        <Row>
          <strong>MergeManager:</strong>{' '}
          <a
            href="https://github.com/PAST3LLE/skilltree-contracts/tree/main/contracts/MergeManager.sol"
            target="_blank noreferrer"
          >
            {MERGE_MANAGER_NETWORKS[SupportedChains.GOERLI].MergeManager.address as Address}
          </a>
        </Row>
      </Column>
    </AppVersionContainer>
  )
}
