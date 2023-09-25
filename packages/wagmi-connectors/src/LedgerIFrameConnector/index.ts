import { IFrameEthereumConnector } from '../IFrameConnector'

export class LedgerLiveFrameConnector extends IFrameEthereumConnector {
  readonly id = 'ledgerLive'
  readonly name = 'Ledger Live'
  readonly ready = true
  readonly isIFrame = true
}
