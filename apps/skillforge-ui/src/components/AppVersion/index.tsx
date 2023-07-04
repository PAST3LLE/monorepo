import COLLECTIONS_MANAGER_NETWORKS from '../../forge-networks.json'
import { Column, Row } from '@past3lle/components'
import { SupportedForgeChains, useForgeUserConfigAtom } from '@past3lle/forge-web3'
import MERGE_MANAGER_NETWORKS from '@past3lle/skilltree-contracts/networks.json'
import MERGE_MANAGER_VERSION from '@past3lle/skilltree-contracts/package.json'
import React, { useCallback } from 'react'
import styled from 'styled-components/macro'
import { Address } from 'wagmi'
import { getBlockExplorerURL } from 'web3/utilts'

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
  const [
    {
      chains,
      user: { chainId }
    }
  ] = useForgeUserConfigAtom()
  const chain = chainId && chains?.find((chain) => chain.id === chainId)

  const getExplorerUrl = useCallback((address: Address) => getBlockExplorerURL(chainId, address, 'address'), [chainId])

  if (!chainId || !chain) return null

  return (
    <Row marginBottom={-100} height={100} style={{ position: 'relative' }}>
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
              href={`${getExplorerUrl(
                COLLECTIONS_MANAGER_NETWORKS?.[chainId as SupportedForgeChains]?.CollectionsManager.address as Address
              )}#code`}
              target="_blank noreferrer"
            >
              {(COLLECTIONS_MANAGER_NETWORKS?.[chainId as SupportedForgeChains]?.CollectionsManager
                .address as Address) || 'CollectionsManager not deployed on this network'}
            </a>
            //
            <a
              href="https://github.com/PAST3LLE/skilltree-contracts/tree/main/contracts/CollectionsManager.sol"
              target="_blank noreferrer"
            >
              Github
            </a>
          </Row>
          <Row>
            <strong>MergeManager:</strong>{' '}
            <a
              href={`${getExplorerUrl(
                MERGE_MANAGER_NETWORKS?.[chainId as SupportedForgeChains]?.MergeManager.address as Address
              )}#code`}
              target="_blank noreferrer"
            >
              {(MERGE_MANAGER_NETWORKS?.[chainId as SupportedForgeChains]?.MergeManager.address as Address) ||
                'MergeManager not deployed on this network'}
            </a>
            //
            <a
              href="https://github.com/PAST3LLE/skilltree-contracts/tree/main/contracts/MergeManager.sol"
              target="_blank noreferrer"
            >
              Github
            </a>
          </Row>
        </Column>
      </AppVersionContainer>
    </Row>
  )
}
