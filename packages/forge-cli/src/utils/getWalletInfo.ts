import { ethers } from 'ethers'

interface Params {
  rpcUrl: string
  mnemonic: string
}
export function getWalletInfo({ rpcUrl, mnemonic }: Params) {
  // Connect to the Ethereum network
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

  // Create a wallet instance using the mnemonic
  const wallet = ethers.Wallet.fromMnemonic(mnemonic)

  // Return the connected wallet to the provider
  return { wallet: wallet.connect(provider), provider }
}
