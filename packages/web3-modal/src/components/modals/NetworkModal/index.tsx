import React, { memo } from 'react'
import { useSwitchNetwork } from 'wagmi'

import { CHAIN_IMAGES } from '../../../constants'
import { usePstlWeb3Modal, useUserConnectionInfo } from '../../../hooks'
import { ConnectorEnhanced } from '../../../types'
import { AccountColumnContainer } from '../AccountModal/styled'
import { ConnectorOption } from '../ConnectionModal/ConnectorOption'
import { WalletsWrapper } from '../common/styled'
import { ModalId } from '../common/types'

function NetworkModalContent() {
  const modalCallbacks = usePstlWeb3Modal()
  const { connector, chain: currentChain, supportedChains } = useUserConnectionInfo()
  const { switchNetworkAsync } = useSwitchNetwork({
    onSuccess() {
      modalCallbacks.close()
    }
  })

  return (
    <AccountColumnContainer width="100%">
      <WalletsWrapper id={`${ModalId.WALLETS}__chains-wrapper`} view={'grid'} width="auto">
        {supportedChains.map((chain) => {
          if (!switchNetworkAsync || currentChain?.id === chain.id) return null
          const chainLogo = CHAIN_IMAGES?.[chain.id]
          return (
            <ConnectorOption
              // keys & ids
              optionType="chain"
              optionValue={chain.id}
              key={chain.id}
              // data props
              callback={() => switchNetworkAsync(chain.id) as any}
              modalView="grid"
              connected={false}
              connector={connector as ConnectorEnhanced<any, any>}
              label={chain.name}
              logo={chainLogo || undefined}
            />
          )
        })}
      </WalletsWrapper>
    </AccountColumnContainer>
  )
}

export const NetworkModal = memo(NetworkModalContent)
