import { JsonRpcBatchProvider, Network } from '@ethersproject/providers'
import type TransportHID from '@ledgerhq/hw-transport-webhid'
import invariant from 'tiny-invariant'
import { Address } from 'viem'

import { checkError, convertToUnsigned } from '../helpers'
import { LedgerHQSigner } from '../signer'
import { TransactionRequestExtended } from '../types'

export class LedgerHQProvider extends JsonRpcBatchProvider {
  public signer?: LedgerHQSigner
  public device?: HIDDevice
  public transport?: typeof TransportHID

  getSigner(): LedgerHQSigner {
    return new LedgerHQSigner(this)
  }

  listAccounts(): Promise<Array<string>> {
    throw new Error('method is not implemented')
  }

  async detectNetwork(): Promise<Network> {
    return this._network
  }

  async getTransport(): Promise<TransportHID> {
    invariant(this.transport, 'Transport is not defined')

    try {
      const transport = (await this.transport.create()) as TransportHID
      this.device = transport.device

      return transport
    } catch (error) {
      return checkError(error)
    }
  }

  async enable(callback?: (...args: any[]) => void): Promise<Address> {
    try {
      const { default: TransportHID } = await import('@ledgerhq/hw-transport-webhid')
      this.transport = TransportHID

      const hid = typeof window !== undefined && window?.navigator?.hid

      if (!hid) throw new Error('User navigator missing HID property! Incompatible.')

      const onDisconnect = (event: HIDConnectionEvent) => {
        if (this.device?.vendorId === event.device.vendorId) {
          hid.removeEventListener('disconnect', onDisconnect)
          this.emit('disconnect')
          callback?.()
        }
      }

      hid.addEventListener('disconnect', onDisconnect)

      if (!this.signer) {
        this.signer = this.getSigner()
      }

      return (await this.getAddress()) as Address
    } catch (error) {
      return checkError(error)
    }
  }

  async getAddress(): Promise<string> {
    invariant(this.signer, 'Signer is not defined')
    return await this.signer.getAddress()
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
}
