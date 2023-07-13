// WC STUFF
import { PstlWeb3ModalProps } from "@past3lle/web3-modal";
import { goerli, mainnet } from "viem/chains";

import { WALLETCONNECT_CONFIG } from "./config/walletconnect";
import { ROOT_CONFIG } from "./config/root";
import { CONNECTORS_CONFIG } from "./config/connectors";

export type SupportedChainIds = 1 | 5
const availableChains = [mainnet, goerli];

export const pstlModalConfig: PstlWeb3ModalProps<1 | 5> = {
    appName: 'CHORUS MODAL TEST',
    chains: availableChains,
    connectors: CONNECTORS_CONFIG,
    modals: {
        root: ROOT_CONFIG,
        walletConnect: WALLETCONNECT_CONFIG
    }
}
