export type ForgeConfig = {
  networks: {
    [network: string]: { rpcUrl: string; id: number }
  }
  mnemonic: string
  etherscanApiKey?: string
}
