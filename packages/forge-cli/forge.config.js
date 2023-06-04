// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotEnv = require('dotenv')
dotEnv.config({ path: process.cwd() + '/env' })

console.log('FORFGE CONFIG CWD', process.cwd())

module.exports = {
  networks: {
    mumbai: {
      rpcUrl: 'https://rpc-mumbai.maticvigil.com',
      id: 80001
    },
    matic: {
      rpcUrl: 'https://rpc-mainnet.maticvigil.com',
      id: 137
    },
    goerli: {
      rpcUrl: 'https://ethereum-goerli.publicnode.com	',
      id: 5
    }
  },
  mnemonic: process.env.MNEMONIC,
  etherscanApiKey: process.env.ETHERSCAN_API_KEY
}
