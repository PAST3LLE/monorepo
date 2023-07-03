import { IFrameEthereumConnector } from '@past3lle/wagmi-connectors'
import { mainnet, Connector } from 'wagmi'

const connectors: Connector<any, any>[] = [new IFrameEthereumConnector({ chains: [mainnet], options: {} })]
export default connectors
