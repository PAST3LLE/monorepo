import { JsonRpcProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'

interface Params {
  rpcUrl: string
  mnemonic: string
}
export function getWalletInfo({ rpcUrl, mnemonic }: Params) {
  // Connect to the Ethereum network
  const provider = new JsonRpcProvider(rpcUrl)

  // Create a wallet instance using the mnemonic
  const wallet = Wallet.fromMnemonic(mnemonic)

  // Return the connected wallet to the provider
  return { wallet: wallet.connect(provider), provider }
}
