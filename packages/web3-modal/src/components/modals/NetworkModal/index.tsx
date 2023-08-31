import React, { memo } from 'react'
import { useSwitchNetwork } from 'wagmi'

import { NO_CHAIN_LOGO } from '../../../constants'
import { useGetChainLogoCallback, usePstlWeb3Modal, useUserConnectionInfo } from '../../../hooks'
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

  const getChainLogo = useGetChainLogoCallback()

  return (
    <AccountColumnContainer width="100%">
      <WalletsWrapper id={`${ModalId.WALLETS}__chains-wrapper`} view={'grid'} width="auto">
        {supportedChains.map((chain) => {
          if (!switchNetworkAsync || currentChain?.id === chain.id) return null
          const chainLogo = getChainLogo(chain.id)
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
              logo={chainLogo || NO_CHAIN_LOGO}
            />
          )
        })}
      </WalletsWrapper>
    </AccountColumnContainer>
  )
}

export const NetworkModal = memo(NetworkModalContent)
