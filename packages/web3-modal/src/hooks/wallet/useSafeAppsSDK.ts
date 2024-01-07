import SafeAppsSDK from '@safe-global/safe-apps-sdk'
import { useEffect, useState } from 'react'

import { useUserConnectionInfo } from '../api/useConnection'
import { useIsSafeApp } from './useWalletMetadata'

export function useSafeAppsSdk(): SafeAppsSDK | null {
  const [safeAppsSdk, setSafeAppsSdk] = useState<SafeAppsSDK | null>(null)
  const { connector } = useUserConnectionInfo()
  const isSafeApp = useIsSafeApp()

  useEffect(() => {
    async function getSafeAppSDK() {
      if (!isSafeApp) {
        setSafeAppsSdk(null)
      } else {
        await connector?.getProvider()

        // setSafeAppsSdk(provider)
      }
    }

    getSafeAppSDK()
  }, [connector, isSafeApp])

  return safeAppsSdk
}
