import {
  ConnectionStatusCtrlState,
  ModalCtrlState,
  RouterCtrlState,
  ToastCtrlState,
  TransactionsCtrlState,
  UserOptionsCtrlState
} from '../types/state'

const STORAGE_KEYS = {
  deepLinkChoice: 'WALLETCONNECT_DEEPLINK_CHOICE',
  transactions: 'W3M_TRANSACTIONS',
  version: 'W3M_VERSION'
} as const

export const CoreUtil = {
  isMobile() {
    if (typeof globalThis?.window !== 'undefined') {
      return Boolean(
        window.matchMedia('(pointer:coarse)').matches ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)
      )
    }

    return false
  },

  isAndroid() {
    return CoreUtil.isMobile() && navigator.userAgent.toLowerCase().includes('android')
  },

  isEmptyObject(value: unknown) {
    return (
      Object.getPrototypeOf(value) === Object.prototype &&
      Object.getOwnPropertyNames(value).length === 0 &&
      Object.getOwnPropertySymbols(value).length === 0
    )
  },

  isHttpUrl(url: string) {
    return url.startsWith('http://') || url.startsWith('https://')
  },

  formatNativeUrl(appUrl: string, wcUri: string, name: string): string {
    if (CoreUtil.isHttpUrl(appUrl)) {
      return this.formatUniversalUrl(appUrl, wcUri, name)
    }
    let safeAppUrl = appUrl
    if (!safeAppUrl.includes('://')) {
      safeAppUrl = appUrl.replaceAll('/', '').replaceAll(':', '')
      safeAppUrl = `${safeAppUrl}://`
    }
    this.setWalletConnectDeepLink(safeAppUrl, name)
    const encodedWcUrl = encodeURIComponent(wcUri)

    return `${safeAppUrl}wc?uri=${encodedWcUrl}`
  },

  formatUniversalUrl(appUrl: string, wcUri: string, name: string): string {
    if (!CoreUtil.isHttpUrl(appUrl)) {
      return this.formatNativeUrl(appUrl, wcUri, name)
    }
    let plainAppUrl = appUrl
    if (appUrl.endsWith('/')) {
      plainAppUrl = appUrl.slice(0, -1)
    }
    this.setWalletConnectDeepLink(plainAppUrl, name)
    const encodedWcUrl = encodeURIComponent(wcUri)

    return `${plainAppUrl}/wc?uri=${encodedWcUrl}`
  },

  async wait(miliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, miliseconds)
    })
  },

  openHref(href: string, target: '_blank' | '_self') {
    window.open(href, target, 'noreferrer noopener')
  },

  setWalletConnectDeepLink(href: string, name: string) {
    localStorage.setItem(STORAGE_KEYS.deepLinkChoice, JSON.stringify({ href, name }))
  },

  setWalletConnectAndroidDeepLink(wcUri: string) {
    const [href] = wcUri.split('?')

    localStorage.setItem(STORAGE_KEYS.deepLinkChoice, JSON.stringify({ href, name: 'Android' }))
  },

  removeWalletConnectDeepLink() {
    localStorage.removeItem(STORAGE_KEYS.deepLinkChoice)
  },

  isNull<T>(value: T | null): value is null {
    return value === null
  },

  setWeb3ModalVersionInStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.version, process.env.ROLLUP_W3M_VERSION ?? 'UNKNOWN')
    }
  },
  getStateFromStorage(key: keyof typeof STORAGE_KEYS, defaultState: any = null) {
    if (typeof globalThis?.window?.localStorage !== 'undefined') {
      const serialisedState = localStorage.getItem(STORAGE_KEYS[key])
      return serialisedState ? JSON.parse(serialisedState) : defaultState
    }
    return defaultState
  },
  setStateToStorage(
    key: keyof typeof STORAGE_KEYS,
    state:
      | ConnectionStatusCtrlState
      | ModalCtrlState
      | RouterCtrlState
      | ToastCtrlState
      | TransactionsCtrlState
      | UserOptionsCtrlState
  ) {
    if (typeof globalThis?.window?.localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(state))
    }
  }
}
