import { isIframe } from '@past3lle/wagmi-connectors'
import { useEffect, useState } from 'react'

import { useUserConnectionInfo } from '../api/useConnection'
import { usePstlWeb3ModalStore } from '../api/usePstlWeb3ModalStore'

const WC_DESKTOP_GNOSIS_SAFE_APP_NAME = 'WalletConnect Safe App'
const WC_MOBILE_GNOSIS_SAFE_APP_NAME = 'Safe'
const SAFE_APP_NAMES = ['Safe App', 'Safe{Wallet}']
const GNOSIS_SAFE_APP_NAME = 'Gnosis Safe App'
const GNOSIS_APP_NAMES = [
  ...SAFE_APP_NAMES,
  GNOSIS_SAFE_APP_NAME,
  WC_DESKTOP_GNOSIS_SAFE_APP_NAME,
  WC_MOBILE_GNOSIS_SAFE_APP_NAME
]

const METADATA_DISCONNECTED: WalletMetaData = {
  walletName: undefined,
  icon: undefined
}

export interface WalletMetaData {
  walletName?: string
  icon?: string
}

function getWcWalletIcon(meta: any) {
  return meta.icons?.length > 0 ? meta.icons[0] : undefined
}

function getWcPeerMetadata(provider: any | undefined): WalletMetaData {
  // fix for this https://github.com/gnosis/cowswap/issues/1929
  const defaultOutput = { walletName: undefined, icon: undefined }

  if (!provider) {
    return defaultOutput
  }

  const meta = provider?.session?.peer?.metadata

  if (meta) {
    return {
      walletName: meta.name,
      icon: getWcWalletIcon(meta)
    }
  }

  return defaultOutput
}

export function useWalletMetadata(): WalletMetaData {
  const {
    state: {
      userOptions: {
        connectors: { overrides }
      }
    }
  } = usePstlWeb3ModalStore()
  const { connector, address: account } = useUserConnectionInfo()
  const [metadata, setMetadata] = useState<WalletMetaData>(METADATA_DISCONNECTED)

  useEffect(() => {
    async function getMetadata() {
      if (!account || !connector) return

      const provider = await connector?.getProvider?.()
      const isWalletConnect = (provider as any)?.isWalletConnect

      if (isWalletConnect) setMetadata(getWcPeerMetadata(provider))
      else setMetadata({ walletName: connector?.name || connector?.id, icon: overrides?.[connector?.name]?.logo })
    }

    getMetadata()
  }, [connector, account, overrides])

  return metadata
}

/**
 * Detects whether the currently connected wallet is a Safe App
 * It'll be false if connected to Safe wallet via WalletConnect
 */
export function useIsSafeApp(): boolean {
  const { connector, isConnected } = useUserConnectionInfo()

  return isConnected && connector?.type === 'safe' && isIframe()
}

/**
 * Detects whether the currently connected wallet is a Safe wallet
 * regardless of the connection method (WalletConnect or inside Safe as an App)
 */
export function useIsSafeWallet(): boolean {
  const isSafeApp = useIsSafeApp()
  const { walletName } = useWalletMetadata()

  if (!walletName) return false

  return isSafeApp || GNOSIS_APP_NAMES.includes(walletName)
}

/**
 * Detects whether the currently connected wallet is a Safe wallet
 * but NOT loaded as a Safe App
 */
export function useIsSafeViaWc(): boolean {
  const isSafeApp = useIsSafeApp()
  const isSafeWallet = useIsSafeWallet()

  return isSafeWallet && !isSafeApp
}
