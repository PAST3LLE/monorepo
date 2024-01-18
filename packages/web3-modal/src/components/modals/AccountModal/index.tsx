import { Column, Row } from '@past3lle/components'
import { useCopyClipboard, useIsSmallMediaWidth, useWindowSize } from '@past3lle/hooks'
import { truncateAddress } from '@past3lle/utils'
import React, { memo, useCallback, useMemo } from 'react'
import { useTheme } from 'styled-components'

import { UserOptionsCtrlState } from '../../../controllers/types'
import { useConnectDisconnect, usePstlWeb3Modal, useUserConnectionInfo } from '../../../hooks'
import { useConnectedChainAndWalletLogo } from '../../../hooks/misc/useLogos'
import { useDeriveAppType } from '../../../utils/connectors'
import { PstlModalTheme } from '../../../theme'
import { ConnectorEnhanced } from '../../../types'
import { BaseModalProps, ModalId } from '../common/types'
import { WalletChainLogos } from './WalletChainLogos'
import {
  AccountColumnContainer,
  AccountModalButton,
  AccountText,
  AddressAndBalanceColumnContainer,
  AddressAndBalanceRow,
  FooterActionButtonsRow,
  Icon,
  WalletAndNetworkRowContainer
} from './styled'

const IS_SERVER = typeof globalThis?.window === 'undefined'

type PstlAccountModalProps = UserOptionsCtrlState['ux'] & Pick<BaseModalProps, 'errorOptions'>

function AccountModalContent({ closeModalOnConnect, errorOptions }: PstlAccountModalProps) {
  const modalCallbacks = usePstlWeb3Modal()
  const userConnectionInfo = useUserConnectionInfo()
  const {
    disconnect: { disconnectAsync }
  } = useConnectDisconnect({
    connect: {
      mutation: {
        onSuccess: closeModalOnConnect ? modalCallbacks.close : undefined
      }
    },
    disconnect: {
      mutation: {
        onSuccess: modalCallbacks.close
      }
    }
  })

  const appType = useDeriveAppType()
  const { isUnsupportedChain, showNetworkButton, isNonFrameWalletApp } = useMemo(() => {
    const isUnsupportedChain = !userConnectionInfo.supportedChains.some(
      (chain) => chain.id === userConnectionInfo.chain?.id
    )
    const supportsSeveralChains = (userConnectionInfo?.supportedChains?.length || 0) > 1

    return {
      isUnsupportedChain,
      showNetworkButton: supportsSeveralChains || isUnsupportedChain,
      isNonFrameWalletApp: appType === 'DAPP' || appType === 'TEST_FRAMEWORK_IFRAME'
    }
  }, [appType, userConnectionInfo.chain?.id, userConnectionInfo.supportedChains])

  const isSmallerScreen = useIsSmallMediaWidth()

  const { chain: chainLogo, wallet: walletLogo } = useConnectedChainAndWalletLogo()

  const [isCopied, onCopy] = useCopyClipboard(1500)
  const onExplorer = useCallback(() => {
    if (
      IS_SERVER ||
      !userConnectionInfo?.chain?.blockExplorers?.default ||
      !userConnectionInfo?.address
    )
      return

    const explorerUrl = userConnectionInfo.chain.blockExplorers.default.url + '/address/' + userConnectionInfo.address
    window.open(explorerUrl, '_blank')
  }, [userConnectionInfo?.chain?.blockExplorers?.default, userConnectionInfo?.address])

  const theme = useModalTheme()
  const { width: winWidth = 0 } = useWindowSize() || {}

  return (
    <AccountColumnContainer width="100%" gap="1rem" overflowY="auto">
      {/* Logos Row */}
      <WalletChainLogos
        wallet={{
          title: userConnectionInfo?.connector?.name || userConnectionInfo?.connector?.id || 'Unknown provider',
          logo: walletLogo
        }}
        chain={{
          title: userConnectionInfo?.chain?.name || userConnectionInfo?.chain?.id?.toString() || 'Unknown chain',
          logo: chainLogo
        }}
      />
      {/* Address and Balance Row */}
      <AddressAndBalanceColumnContainer cursor="pointer" borderRadius="1rem" padding="1em" gap="1rem">
        <Column>
          <AddressAndBalanceRow
            justifyContent="flex-start"
            gap="10px"
            style={{ cursor: 'pointer', zIndex: 1 }}
            title={userConnectionInfo.address}
            onClick={() => onCopy(userConnectionInfo?.address || '')}
          >
            <AccountText id={`${ModalId.ACCOUNT}__address-text`} node="header" css="text-transform: initial;">
              {userConnectionInfo.address
                ? isCopied
                  ? 'Copied!'
                  : truncateAddress(userConnectionInfo.address, { type: winWidth < 360 ? 'short' : 'long' })
                : 'Disconnected'}
            </AccountText>
            {theme?.account?.icons?.copy?.url && <Icon src={theme?.account?.icons?.copy?.url} />}
          </AddressAndBalanceRow>
          <AddressAndBalanceRow id={`${ModalId.ACCOUNT}__balance-text`}>
            <AccountText node="subHeader">Balance:</AccountText>
            <AccountText node="subHeader" title={userConnectionInfo.balance.data?.formatted || '0'} marginLeft={'5px'}>
              {Number(userConnectionInfo.balance.data?.formatted || 0).toLocaleString([], {
                maximumSignificantDigits: 4
              })}{' '}
              {userConnectionInfo.balance.data?.symbol || 'N/A'}
            </AccountText>
          </AddressAndBalanceRow>
        </Column>
        <FooterActionButtonsRow
          flexDirection="column"
          justifyContent="center"
          gap="10px"
          minWidth={150}
          style={{ zIndex: errorOptions?.show ? 0 : 1 }}
        >
          <AccountModalButton
            id={`${ModalId.ACCOUNT}__explorer-button`}
            node="main"
            connected={false}
            padding="0.6rem"
            onClick={() => onExplorer()}
          >
            {`${isSmallerScreen ? '' : 'View on '}Explorer`}
          </AccountModalButton>
          <AccountModalButton
            id={`${ModalId.ACCOUNT}__transactions-button`}
            node="main"
            connected={false}
            padding="0.6rem"
            onClick={() => modalCallbacks.open({ route: 'Transactions', withHistory: true })}
          >
            {`${isSmallerScreen ? '' : 'View '}Transactions`}
          </AccountModalButton>
        </FooterActionButtonsRow>
      </AddressAndBalanceColumnContainer>
      {/* Wallet & Network Row */}
      <WalletAndNetworkRowContainer
        cursor={isNonFrameWalletApp ? 'pointer' : 'initial'}
        width="100%"
        padding="1em"
        backgroundColor={isUnsupportedChain ? theme?.base?.background?.error : undefined}
      >
        <Column width="100%" maxWidth={400} gap="1rem">
          {/* Wallet & Network Row */}
          <Row
            id={`${ModalId.ACCOUNT}__wallets-button`}
            fontSize="unset"
            height="auto"
            minHeight={82}
            width="100%"
            onClick={() => isNonFrameWalletApp && modalCallbacks.open({ route: 'ConnectWallet', withHistory: true })}
          >
            <Column width="100%" gap="0.3rem">
              <Row flexWrap="wrap" gap="0 0.5rem" id="pstl-web3-modal-wallet-text">
                <AccountText node="subHeader" display="inline-flex" alignItems="center" width="auto">
                  {theme?.account?.icons?.wallet?.url && <Icon src={theme?.account?.icons?.wallet?.url} />}
                  Wallet:{' '}
                </AccountText>
                <AccountText
                  node="main"
                  cursor="pointer"
                  fontSize="inherit"
                  fontWeight={700}
                  display="inline-flex"
                  alignItems="center"
                  padding={0}
                >
                  {(userConnectionInfo.connector as ConnectorEnhanced)?.customName ||
                    userConnectionInfo.connector?.name}
                </AccountText>
              </Row>
              <Row flexWrap="wrap" gap="0 0.5rem" id="pstl-web3-modal-wallet-text">
                <AccountText node="subHeader" display="inline-flex" alignItems="center" width="auto">
                  {theme?.account?.icons?.network?.url && <Icon src={theme?.account?.icons?.network?.url} />}
                  Network:{' '}
                </AccountText>
                <AccountText node="main" fontSize="inherit" display="inline-flex" alignItems="center" padding={0}>
                  {userConnectionInfo.chain?.name || userConnectionInfo.chain?.id || 'Unknown network'}
                  {isUnsupportedChain && <small className="unsupported-small-text">[unsupported]</small>}
                </AccountText>
              </Row>
            </Column>
          </Row>
          {/* Switch Network & Disconnect Buttons */}
          <Row
            id={`${ModalId.ACCOUNT}__network-disconnect-buttons`}
            flex="1 1 auto"
            width="auto"
            minWidth={150}
            gap="1rem"
          >
            {showNetworkButton && (
              <AccountModalButton
                node="main"
                id={`${ModalId.ACCOUNT}__network-button`}
                connected={false}
                padding="0.6rem 1.2rem"
                onClick={() => modalCallbacks.open({ route: 'SelectNetwork', withHistory: true })}
              >
                Switch Network
              </AccountModalButton>
            )}
            {isNonFrameWalletApp && (
              <AccountModalButton
                node="alternate"
                id={`${ModalId.ACCOUNT}__disconnect-button`}
                connected={false}
                padding="0.6rem"
                onClick={async () => {
                  await disconnectAsync()
                }}
              >
                Disconnect
              </AccountModalButton>
            )}
          </Row>
        </Column>
      </WalletAndNetworkRowContainer>
    </AccountColumnContainer>
  )
}

function useModalTheme(): PstlModalTheme['modals'] {
  const theme = useTheme()
  return theme.modals
}

export default memo(AccountModalContent)
