// import { Writable } from '@past3lle/types'
// import { devDebug } from '@past3lle/utils'
// import { defaultWagmiConfig } from '@web3modal/wagmi'
// import { useEffect } from 'react'

// import { CHAIN_IMAGES, Z_INDICES } from '../../constants'
// import { PstlWeb3ModalProps, ReadonlyChains } from '../types'

// type Props<chains extends ReadonlyChains = ReadonlyChains> = {
//   chains: Writable<PstlWeb3ModalProps<chains>['chains']>
//   config: PstlWeb3ModalProps<chains>['modals']['walletConnect']
// }
// export const Web3Modal = <w3chains extends ReadonlyChains = ReadonlyChains>({
//   chains,
//   config: { projectId, zIndex = Z_INDICES.W3M, themeVariables, ...w3mProps }
// }: Props<w3chains>) => {
//   if (!projectId) {
//     throw new Error('MISSING or INVALID WalletConnect options! Please check your config object.')
//   }

//   useEffect(() => {
//     if (projectId) {
//       devDebug('[@past3lle/web3-modal]::IMPORTING WEB3MODAL')
//       import('@web3modal/wagmi')
//         .then(({ createWeb3Modal }) => {
//           const wagmiConfig = defaultWagmiConfig({
//             chains,
//             projectId,
//             metadata: {
//               name: '123123',
//               description: 'asd',
//               url: 'asd',
//               icons: ['asdasd'],
//               verifyUrl: 'asdasd'
//             }
//           })
//           createWeb3Modal({
//             ...w3mProps,
//             chainImages: w3mProps.chainImages || CHAIN_IMAGES,
//             wagmiConfig,
//             projectId,
//             chains
//           })
//         })
//         .catch(console.error)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [projectId])

//   return null
// }

export {}
