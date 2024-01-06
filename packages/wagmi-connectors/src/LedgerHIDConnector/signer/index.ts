import { Signer, TypedDataDomain, TypedDataField, TypedDataSigner } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { Bytes, hexlify, joinSignature } from '@ethersproject/bytes'
import { _TypedDataEncoder } from '@ethersproject/hash'
import { JsonRpcSigner, TransactionRequest } from '@ethersproject/providers'
import { toUtf8Bytes } from '@ethersproject/strings'
import { UnsignedTransaction, serialize } from '@ethersproject/transactions'
import Eth, { ledgerService } from '@ledgerhq/hw-app-eth'
import { EIP712Message } from '@ledgerhq/hw-app-eth/lib-es/modules/EIP712/EIP712.types'

import { checkError, convertToUnsigned, toNumber } from '../helpers'
import { LedgerHQProvider } from '../provider'
import { LoadConfig, ResolutionConfig, UnsignedTransactionStrict } from '../types'

const defaultPath = "m/44'/60'/0'/0/0"
export class LedgerHQSigner extends Signer implements TypedDataSigner {
  readonly path: string
  readonly provider: LedgerHQProvider

  _index = 0
  _address = ''
  _addressMap = new Map<string, string>()

  constructor(provider: LedgerHQProvider, path: string = defaultPath) {
    super()

    this.path = path
    this.provider = provider
  }

  async withEthApp<T>(callback: (eth: Eth) => T): Promise<T> {
    const transport = await this.provider.getTransport()

    try {
      // Safe as we check status in this._checkHidStatus() above
      const eth = new Eth(transport)
      await eth.getAppConfiguration()

      return await callback(eth)
    } catch (error) {
      return checkError(error)
    } finally {
      await transport.close()
    }
  }

  async getAddress(path = this.path): Promise<string> {
    if (!this._addressMap.has(path)) {
      const address = await this._queryAndFormatAddress(path)
      this._address = address
      this._addressMap.set(path, address)
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._addressMap.get(path)!
  }

  async setAddress(path = this.path): Promise<void> {
    if (!this._addressMap.has(path)) {
      const address = await this._queryAndFormatAddress(path)
      this._address = address
      this._addressMap.set(path, address)
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._address = this._addressMap.get(path)!
  }

  public getConnectedAddress() {
    return this._address
  }

  async signMessage(message: Bytes | string): Promise<string> {
    if (typeof message === 'string') {
      message = toUtf8Bytes(message)
    }

    const messageHex = hexlify(message).substring(2)
    const sig = await this.withEthApp((eth) => eth.signPersonalMessage(this.path, messageHex))

    sig.r = '0x' + sig.r
    sig.s = '0x' + sig.s

    return joinSignature(sig)
  }

  async populateUnsigned(transaction: UnsignedTransactionStrict): Promise<UnsignedTransaction> {
    const populated = await this.populateTransaction(transaction)
    const nonce = toNumber(populated.nonce)

    if (populated.type === 0) {
      const { gasLimit, type, chainId, gasPrice, value, data, to } = populated

      // Allowed transaction keys for Legacy and EIP-155 Transactions
      return { gasLimit, type, chainId, gasPrice, nonce, value, data, to }
    }

    return { ...populated, nonce }
  }

  async signTransaction(
    transaction: TransactionRequest,
    loadConfig: LoadConfig = {},
    resolutionConfig: ResolutionConfig = {}
  ): Promise<string> {
    const unsignedTx = await convertToUnsigned(transaction)
    const populatedTx = await this.populateUnsigned(unsignedTx)

    const serializedTx = serialize(populatedTx).substring(2)
    // Safe as checked above in this._checkHidStatus()
    const resolution = await ledgerService.resolveTransaction(serializedTx, loadConfig, resolutionConfig)

    const sig = await this.withEthApp((eth) => eth.signTransaction(this.path, serializedTx, resolution))

    return serialize(populatedTx, {
      v: BigNumber.from('0x' + sig.v).toNumber(),
      r: '0x' + sig.r,
      s: '0x' + sig.s
    })
  }

  connect(provider: LedgerHQProvider): JsonRpcSigner {
    return new LedgerHQSigner(provider, this.path)
  }

  connectUnchecked(): JsonRpcSigner {
    throw new Error('method is not implemented')
  }

  sendUncheckedTransaction(): Promise<string> {
    throw new Error('method is not implemented')
  }

  async unlock(): Promise<boolean> {
    throw new Error('method is not implemented')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async _legacySignMessage(_: Bytes | string): Promise<string> {
    throw new Error('method is not implemented')
  }

  // _signTypedData as per ethers Signer, cleans up types, replaces domain, calculates primaryType
  async _signTypedData(
    domain: TypedDataDomain,
    { EIP712Domain: _, ...types }: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ): Promise<string> {
    const encoder = new _TypedDataEncoder(types)
    const data = {
      domain: {
        name: domain.name,
        verifyingContract: domain.verifyingContract,
        version: domain.version,
        chainId: domain.chainId ? parseInt(domain.chainId.toString()) : undefined
      },
      types: {
        ...types,
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ]
      },
      primaryType: encoder.primaryType,
      message: value
    }

    return this.__signEIP712Message(data)
  }

  // custom method, also called directly on eth_signTypedData_v4 RPC request
  async __signEIP712Message(data: EIP712Message): Promise<string> {
    const { r, s, v } = await this.withEthApp((eth) => eth.signEIP712Message(this.path, data))

    return joinSignature({ r: '0x' + r, s: '0x' + s, v })
  }

  private async _queryAndFormatAddress(path: string) {
    const account = await this.withEthApp((eth) => eth.getAddress(path))

    const address = this.provider.formatter.address(account.address)
    return address
  }
}
