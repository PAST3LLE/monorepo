import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { resolveProperties } from '@ethersproject/properties'

import { TransactionRequestExtended, UnsignedTransactionStrict } from '../types'

const IS_SERVER = typeof globalThis?.window === 'undefined'

export const isHIDSupported = () => {
  try {
    if (IS_SERVER)
      throw new Error('HID support check error! IS_SERVER flag returned true. Server environments not supported.')
    return !IS_SERVER && 'hid' in window.navigator
  } catch (error) {
    return false
  }
}

export const hasEIP1559 = (tx: { type?: number; maxFeePerGas?: BigNumberish; maxPriorityFeePerGas?: BigNumberish }) => {
  return tx.type === 2 || tx.maxFeePerGas != null || tx.maxPriorityFeePerGas != null
}

export const toNumber = (value: BigNumberish | undefined | null): number | undefined => {
  return value == null ? undefined : BigNumber.from(value).toNumber()
}

export const convertToUnsigned = async (tx: TransactionRequestExtended): Promise<UnsignedTransactionStrict> => {
  const resolvedTx = await resolveProperties(tx)

  const { chainId, data, gasLimit, gas, gasPrice, value, to } = resolvedTx
  const nonce = toNumber(resolvedTx.nonce)
  const type = toNumber(resolvedTx.type)

  // Allowed transaction keys for Legacy and EIP-155 Transactions
  const baseTx: UnsignedTransactionStrict = {
    gasLimit: gasLimit || gas,
    type: type ?? 2,
    chainId,
    gasPrice,
    nonce,
    value,
    data,
    to
  }

  // EIP-2930
  if (tx.accessList != null) {
    baseTx.accessList = tx.accessList
  }

  // EIP-1559
  if (hasEIP1559(tx)) {
    baseTx.maxFeePerGas = tx.maxFeePerGas
    baseTx.maxPriorityFeePerGas = tx.maxPriorityFeePerGas
    baseTx.type = 2
  }

  return baseTx
}

export const checkError = (error: any): never => {
  if (error.statusText === 'INS_NOT_SUPPORTED') {
    error.message = 'Device is not supported. Make sure the Ethereum app is open on the device.'
  }

  if (error.statusText === 'UNKNOWN_ERROR') {
    error.message = 'Unknown error. Make sure the device is connected and the Ethereum app is open on the device.'
  }

  if (error.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
    error.message = 'User rejected the request'
  }

  throw error
}
