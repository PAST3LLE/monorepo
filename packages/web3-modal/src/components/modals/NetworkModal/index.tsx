import { useIsExtraSmallMediaWidth } from '@past3lle/hooks'
import { devDebug, devError } from '@past3lle/utils'
import React, { memo } from 'react'
import { useSwitchChain } from 'wagmi'

import { useGetChainIconCallback, usePstlWeb3Modal, usePstlWeb3ModalStore, useUserConnectionInfo } from '../../../hooks'
import { MissingChainIcon } from '../../MissingChainIcon'
import { AccountColumnContainer } from '../AccountModal/styled'
import { ConnectorOption } from '../ConnectionModal/ConnectorOption'
import { WalletsWrapper } from '../common/styled'
import { ModalId } from '../common/types'

function NetworkModalContent() {
  const modalCallbacks = usePstlWeb3Modal()
  const modalStore = usePstlWeb3ModalStore()

  const { chain: currentChain, supportedChains } = useUserConnectionInfo()

  const { switchChainAsync } = useSwitchChain({
    mutation: {
      async onSuccess(data) {
        devDebug(
          '[@past3lle/web3-modals::NetworkModal] Success switching networks!',
          !!modalCallbacks,
          data?.id,
          data?.name
        )
        return modalCallbacks.close()
      },
      async onError(error) {
        devError('[@past3lle/web3-modals::NetworkModal] Error switching networks!', error?.message || error)
        return modalStore.callbacks.error.set(error)
      }
    }
  })

  const getChainIcon = useGetChainIconCallback()

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
        width="100%"
      >
        {supportedChains.map((chain) => {
          if (!switchChainAsync || currentChain?.id === chain.id) return null
          const chainIcon = getChainIcon(chain.id)
          return (
            <ConnectorOption
              // keys & ids
              optionType="chain"
              optionValue={chain.id}
              key={chain.id}
              // data props
              callback={async () => switchChainAsync({ chainId: chain.id })}
              modalView={modalView}
              connected={false}
              label={chain.name}
              icon={chainIcon ? <img src={chainIcon} /> : <MissingChainIcon />}
            />
          )
        })}
      </WalletsWrapper>
    </AccountColumnContainer>
  )
}

export default memo(NetworkModalContent)
