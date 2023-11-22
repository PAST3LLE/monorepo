import { useIsExtraSmallMediaWidth } from '@past3lle/hooks'
import React, { memo } from 'react'
import { useSwitchNetwork } from 'wagmi'

import { useGetChainLogoCallback, usePstlWeb3Modal, usePstlWeb3ModalStore, useUserConnectionInfo } from '../../../hooks'
import { ConnectorEnhanced } from '../../../types'
import { NoChainLogo } from '../../NoChainLogo'
import { AccountColumnContainer } from '../AccountModal/styled'
import { ConnectorOption } from '../ConnectionModal/ConnectorOption'
import { WalletsWrapper } from '../common/styled'
import { ModalId } from '../common/types'

function NetworkModalContent() {
  const modalCallbacks = usePstlWeb3Modal()
  const modalStore = usePstlWeb3ModalStore()

  const { connector, chain: currentChain, supportedChains } = useUserConnectionInfo()

  const { switchNetworkAsync } = useSwitchNetwork({
    onSuccess() {
      modalCallbacks.close()
    },
    onError(error) {
      modalStore.updateModalProps({
        network: {
          error
        }
      })
    }
  })

  const getChainLogo = useGetChainLogoCallback()

  // We always show list view in tiny screens
  const isExtraSmallScreen = useIsExtraSmallMediaWidth()
  const modalView = isExtraSmallScreen ? 'list' : 'grid'

  return (
    <AccountColumnContainer width="100%">
      <WalletsWrapper
        id={`${ModalId.WALLETS}__chains-wrapper`}
        modal="connection"
        node="main"
        view={modalView}
        width="auto"
      >
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
              callback={async () => switchNetworkAsync(chain.id)}
              modalView={modalView}
              connected={false}
              connector={connector as ConnectorEnhanced<any, any>}
              label={chain.name}
              logo={chainLogo ? <img src={chainLogo} /> : <NoChainLogo />}
            />
          )
        })}
      </WalletsWrapper>
    </AccountColumnContainer>
  )
}

export default memo(NetworkModalContent)
