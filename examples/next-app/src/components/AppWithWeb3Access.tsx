'use client'

import { useWindowSize } from '@past3lle/hooks'
import { usePstlUserConnectionInfo } from '@past3lle/web3-modal'

const AppWithWeb3Access = () => {
  const { address } = usePstlUserConnectionInfo()
  const windowSizes = useWindowSize()
  return (
    <>
      <h1>Here has wagmi access</h1>
      <strong>Address: {address}</strong>
      <p>SIZES</p>
      <p>WIDTH: {windowSizes?.width}</p>
      <p>HEIGHT: {windowSizes?.height}</p>
    </>
  )
}

export default AppWithWeb3Access
