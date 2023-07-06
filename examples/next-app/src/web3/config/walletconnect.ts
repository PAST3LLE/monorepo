import { PstlWeb3ModalProps } from "@past3lle/web3-modal";
import { PALETTE } from "../theme";
import { SupportedChainIds } from "../connection";

// CONNECTION INFO
const WALLETCONNECT_PROJECT_KEY = "d2dca0cfaa13e8b4c340b762c05c3708";
export const WALLETCONNECT_CONFIG: PstlWeb3ModalProps<SupportedChainIds>['modals']['walletConnect'] = {
    projectId: WALLETCONNECT_PROJECT_KEY,
    enableNetworkView: true,
    explorerExcludedWalletIds: "ALL",
    explorerRecommendedWalletIds: [
        // wallet ids from wallet connect (https://walletconnect.com/explorer).
        "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // metamask
        "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927", // legder live
        "5864e2ced7c293ed18ac35e0db085c09ed567d67346ccb6f58a0327a75137489" // fireblocks 
    ],
    zIndex: 1000,
    themeMode: 'dark',
    themeVariables: {
        '--w3m-overlay-background-color': PALETTE.blackOpaque3,
        '--w3m-background-color': PALETTE.mainBg,
        '--w3m-background-image-url':
        'https://uploads-ssl.webflow.com/63fdf8c863bcf0c02efdffbc/64144c23e693f7d7f5cdb958_chorus_logo.svg',
        '--w3m-accent-color': PALETTE.mainBg,
        '--w3m-color-bg-1': PALETTE.blackOpaque1
    }
}