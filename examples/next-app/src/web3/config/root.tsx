import { ConnectorOverrides, PstlWeb3ModalProps } from "@past3lle/web3-modal";
import { SupportedChainIds } from "../connection";
import theme from "../theme";

enum WalletRank {
  walletConnect = 10,
  ledger = 9,
}
export const CONNECTOR_DISPLAY_OVERRIDES: ConnectorOverrides = {
  walletconnect: {
    logo: 'https://repository-images.githubusercontent.com/204001588/a5169900-c66c-11e9-8592-33c7334dfd6d',
    // Uncomment to add helper text under connectors
    // infoText: {
    //   title: 'What is this option?',
    //   content: 'Choose this to open the WalletConnect wallet modal and select a 3rd party wallet of your choice!'
    // },
    rank: WalletRank['walletConnect']
  },
  metamask: {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png',
    isRecommended: true,
    rank: WalletRank['ledger'] - 1,
    downloadUrl: 'https://metamask.io/download'
  },
  taho: {
    logo: 'https://user-images.githubusercontent.com/95715502/221033622-fb606b37-93f1-485b-9ce5-59b92f756033.png',
    isRecommended: true,
    rank: WalletRank['ledger'] - 1,
    downloadUrl: 'https://taho.xyz'
  },
  coinbasewallet: {
    logo: 'https://altcoinsbox.com/wp-content/uploads/2022/12/coinbase-logo.webp',
    isRecommended: true,
    rank: WalletRank['ledger'] - 1
  },
  ledger: {
    logo: 'https://crypto-central.io/library/uploads/Ledger-Logo-3.png',
    customName: 'LEDGER LIVE',
    modalNodeId: 'ModalWrapper',
    isRecommended: true,
    rank: WalletRank['ledger']
  },
  'ledger-hid': {
    customName: 'LEDGER HID',
    logo: 'https://crypto-central.io/library/uploads/Ledger-Logo-3.png',
    rank: 10,
    isRecommended: true,
    infoText: {
      title: 'What is Ledger HID?',
      content: <strong>Ledger wallet is a cold storage hardware wallet.</strong>
    }
  }
}

export const ROOT_CONFIG: PstlWeb3ModalProps<SupportedChainIds>['modals']['root'] = {
  maxWidth: '600px',
  minHeight: '600px',
  walletsView: 'grid',
  themeConfig: {
    theme
  },
  connectorDisplayOverrides: CONNECTOR_DISPLAY_OVERRIDES,
  closeModalOnConnect: true
}