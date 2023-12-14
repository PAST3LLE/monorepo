import { devDebug } from '@past3lle/utils'
import { Alchemy, AlchemySubscription, Network } from 'alchemy-sdk'
import { useEffect, useState } from 'react'

import { useForgeTransactionAtom } from '..'
import { useForgeUserConfigAtom } from '../../UserConfig'

// Get all the NFTs owned by an address
// const nfts = alchemy.nft.getNftsForOwner("vitalik.eth");

export function ForgeTransactionStatusUpdater() {
  const [
    {
      user: { account }
    }
  ] = useForgeUserConfigAtom()
  const [, setTransactions] = useForgeTransactionAtom()

  const alchemy = useCreateAlchemySDK()

  useEffect(() => {
    if (!account || !alchemy) return

    function pendingTxListener(res: any) {
      devDebug('ALCHEMY WS::PENDING TX -->', res)
      setTransactions(res.hash)
    }
    function minedTxListener(res: any) {
      devDebug('ALCHEMY WS::MINED TX -->')
      setTransactions(res.hash)
    }
    // Listen to all new pending transactions
    alchemy.ws.on({ method: AlchemySubscription.PENDING_TRANSACTIONS, fromAddress: account }, pendingTxListener)
    // Listen to all new pending transactions
    alchemy.ws.on(
      {
        method: AlchemySubscription.MINED_TRANSACTIONS,
        addresses: [{ from: account }]
      },
      minedTxListener
    )

    alchemy.nft.getOwnersForNft('0x30bE87dc59f046865ae420566aE4975cf6Eb5f22', BigInt(0)).then(devDebug)

    return () => {
      devDebug('[@past3lle/forge-web3] TRANSACTIONS UPDATER -- UNMOUNT DETECTED. REMOVING WS SUBSCRIPTIONS.')
      alchemy.ws.off(AlchemySubscription.PENDING_TRANSACTIONS, pendingTxListener)
      alchemy.ws.off(AlchemySubscription.MINED_TRANSACTIONS, minedTxListener)
    }
  }, [account, alchemy, setTransactions])

  return null
}

const TEST_MUMBAI_KEY_DONT_USE_IN_PROD = 'bn6RsUwCghgB-tHmk8Slyv4r4ZYopx9g'
export function useCreateAlchemySDK() {
  const [sdk, setSdk] = useState<Alchemy | null>(null)
  const [
    {
      user: { chainId }
    }
  ] = useForgeUserConfigAtom()

  useEffect(() => {
    const alchemyNetwork = _mapChainIdToAlchemyNetwork(chainId)
    if (typeof globalThis?.window === 'undefined' || !chainId || !alchemyNetwork) return

    const chainAwareSdk = new Alchemy({
      network: alchemyNetwork,
      apiKey: TEST_MUMBAI_KEY_DONT_USE_IN_PROD
    })

    devDebug('[@past3lle/forge-web3] ALCHEMY SDK INSTANTIATED @ CHAIN ID', chainId)

    setSdk(chainAwareSdk)
  }, [chainId])

  return sdk
}

function _mapChainIdToAlchemyNetwork(chainId?: number) {
  switch (chainId) {
    case 1:
      return Network.ETH_MAINNET
    case 5:
      return Network.ETH_GOERLI
    case 137:
      return Network.MATIC_MAINNET
    case 80001:
      return Network.MATIC_MUMBAI
    default:
      return null
  }
}
