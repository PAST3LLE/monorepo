import { ethers } from 'ethers'

import { SupportedNetworks } from '../types/networks'
import { getGasStationUri } from './getGasStationUri'

export async function getFeeData(network: SupportedNetworks) {
  // get max fees from gas station
  let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
  let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
  try {
    const gasStationUri = getGasStationUri(network)
    console.log('[Forge-CLI] Gas Station URI:', gasStationUri)
    const res = await (await fetch(gasStationUri)).json()
    const data = res?.fast ?? res?.data?.fast
    console.log('[Forge-CLI] Gas Station response:', data)
    maxFeePerGas = ethers.utils
      .parseUnits(Math.ceil(data.maxFee) + '', 'gwei')
      .mul(125)
      .div(100)
    maxPriorityFeePerGas = ethers.utils
      .parseUnits(Math.ceil(data.maxPriorityFee) + '', 'gwei')
      .mul(125)
      .div(100)
  } catch (error) {
    console.error(error)
  }

  const feeData = {
    maxFeePerGas,
    maxPriorityFeePerGas
  }
  console.log('[Forge-CLI] Fee data:', feeData)
  return feeData
}
