import { addFrameConnector } from '@past3lle/forge-web3'
import { IFrameEthereumConnector } from '@past3lle/wagmi-connectors'

const frameConnectors = [addFrameConnector(IFrameEthereumConnector, {})]
export { frameConnectors }
