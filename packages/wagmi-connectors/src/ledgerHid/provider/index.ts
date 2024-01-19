import { JsonRpcBatchProvider, Network } from '@ethersproject/providers'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import invariant from 'tiny-invariant'
import { Address } from 'viem'

import { checkError, convertToUnsigned } from '../helpers'
import { LedgerHQSigner } from '../signer'
import { TransactionRequestExtended } from '../types'

const IS_SERVER = typeof globalThis?.window === 'undefined'

export class LedgerHQProvider extends JsonRpcBatchProvider {
  public signer?: LedgerHQSigner
  public device?: HIDDevice
  public transport?: typeof TransportWebHID

  getSigner(path?: string): LedgerHQSigner {
    return new LedgerHQSigner(this, path)
  }

  listAccounts(): Promise<Array<string>> {
    throw new Error('method is not implemented')
  }

  async detectNetwork(): Promise<Network> {
    return this._network
  }

  async getTransport(): Promise<TransportWebHID> {
    invariant(!!this.transport?.request, 'Transport is not defined')

    try {
      const transport = (await this.transport.create()) as TransportWebHID
      this.device = transport.device

      return transport
    } catch (error) {
      return checkError(error)
    }
  }

  async enable(callback?: (...args: any[]) => void, path?: string, reset?: boolean): Promise<Address> {
    try {
      this.transport = TransportWebHID

      const hid = !IS_SERVER && window?.navigator?.hid

      if (!hid) throw new Error('User navigator missing HID property! Incompatible.')

      const onHidDisconnect = (event: HIDConnectionEvent) => {
        if (this.device?.vendorId === event.device.vendorId) {
          hid.removeEventListener('disconnect', onHidDisconnect)
          this.disable()
          callback?.()
        }
      }

      hid.addEventListener('disconnect', onHidDisconnect)

      if (!!reset || !this.signer) {
        this.signer = this.getSigner(path)
      }

      const address = (await this.getAddress(path)) as Address

      this.onConnect({ accounts: [address], chainId: this._network.chainId })

      return address
    } catch (error) {
      return checkError(error)
    }
  }

  onConnect(params: { accounts: string[]; chainId: number }) {
    this.emit('connect', params)
  }
  onDisconnect() {
    this.emit('disconnect')
  }

  async disable(): Promise<void> {
    try {
      this._shutdown()
      this.onDisconnect()
    } catch (error) {
      return checkError(error)
    }
  }

  async getAddress(path?: string): Promise<string> {
    invariant(this.signer, 'Signer is not defined')
    return this.signer.getAddress(path)
  }

  async setAddress(path?: string): Promise<void> {
    invariant(this.signer, 'Signer is not defined')
    return this.signer.setAddress(path)
  }

  public getConnectedAddress(): string | undefined {
    return this.signer?._address
  }

  async request({ method, params }: { method: string; params: Array<unknown> }): Promise<unknown> {
    invariant(this.signer, 'Signer is not defined')
    switch (method) {
      case 'eth_sendTransaction':
        const sourceTx = params[0] as TransactionRequestExtended
        const unsignedTx = await convertToUnsigned(sourceTx)
        const signedTx = await this.signer.signTransaction(unsignedTx)
        return this.send('eth_sendRawTransaction', [signedTx])
      case 'eth_accounts':
        return [await this.getAddress()]
      case 'eth_signTypedData_v4':
        if (typeof params[1] !== 'string') throw new Error('eth_signTypedData_v4 arg 1 is not a string')
        const payload = JSON.parse(params[1] as string)
        return await this.signer.__signEIP712Message({
          domain: payload.domain,
          types: payload.types,
          primaryType: payload.primaryType,
          message: payload.message
        })
      default:
        return this.send(method, params)
    }
  }

  private _shutdown() {
    this.transport = undefined
    this.device = undefined
    this.signer = undefined
  }
}
