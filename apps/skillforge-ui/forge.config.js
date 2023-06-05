module.exports = {
  networks: {
    goerli: {
      id: 5,
      rpcUrl: process.env.GOERLI_RPC_URL
    },
    matic: {
      id: 137,
      rpcUrl: process.env.POLYGON_RPC_URL
    },
    mumbai: {
      id: 80001,
      rpcUrl: process.env.ALCHEMY_RPC_URL
    }
  },
  mnemonic: process.env.MNEMONIC,
  etherscanApiKey: process.env.ETHERSCAN_API_KEY
}
