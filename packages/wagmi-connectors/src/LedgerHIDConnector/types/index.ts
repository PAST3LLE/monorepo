import { BigNumberish } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/providers'
import { UnsignedTransaction } from '@ethersproject/transactions'
import { Address } from 'viem'

export type UnsignedTransactionStrict = Omit<UnsignedTransaction, 'type'> & {
  type?: number
}

export type TransactionRequestExtended = TransactionRequest & {
  gas?: BigNumberish
}

export type ConnectorUpdate<P> = { provider: P; account: string | Address }

export type LoadConfig = {
  nftExplorerBaseURL?: string | null;
  pluginBaseURL?: string | null;
  extraPlugins?: any | null;
  cryptoassetsBaseURL?: string | null;
}

export type SupportedRegistries = "ens";

export type DomainServiceResolution = {
  registry: SupportedRegistries;
  domain: string;
  address: string;
  type: "forward" | "reverse";
};

/**
 * Allows to configure precisely what the service need to resolve.
 * for instance you can set nft:true if you need clear signing on NFTs. If you set it and it is not a NFT transaction, it should still work but will do a useless service resolution.
 */
export type ResolutionConfig = {
  // NFT resolution service
  nft?: boolean;
  // external plugins resolution service (e.G. LIDO)
  externalPlugins?: boolean;
  // ERC20 resolution service (to clear sign erc20 transfers & other actions)
  erc20?: boolean;
  // List of trusted names (ENS for now) to clear sign
  domains?: DomainServiceResolution[];
};