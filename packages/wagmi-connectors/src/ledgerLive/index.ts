import { type IframeEthereumParameters, iframeEthereum } from "../iframeEthereum" 

export type LedgerLiveParameters = Omit<IframeEthereumParameters, 'name' | 'id' | 'type'>
export const ledgerLive = (options: LedgerLiveParameters) => iframeEthereum({
    name: 'Ledger Live',
    id: 'ledgerLive',
    type: 'ledgerLive',
    ...options
})

