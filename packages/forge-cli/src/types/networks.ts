export type ForgeConfig = {
  networks: {
    [Network in SupportedNetworks]: { rpcUrl: string; id: number }
  }
  mnemonic: string
  etherscanApiKey?: string
}

export type ContractNames = 'CollectionsManager' | string

export type NetworksJson = {
  [chainId: string]: {
    [contractName in ContractNames]: {
      address: string
      transactionHash: string | undefined
    }
  }
}

export enum SupportedNetworks {
  GOERLI = 'goerli',
  MAINNET = 'mainnet',
  MUMBAI = 'mumbai',
  MATIC = 'matic',
  POLYGON = 'polygon'
}
