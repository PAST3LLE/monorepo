import { Column, Row } from '@past3lle/components'
import { useCopyClipboard, useIsSmallMediaWidth } from '@past3lle/hooks'
import { truncateAddress } from '@past3lle/utils'
import React, { memo, useCallback, useMemo } from 'react'
import { useTheme } from 'styled-components'

import { ModalPropsCtrlState } from '../../../controllers/types/controllerTypes'
import { useConnectDisconnect, usePstlWeb3Modal, useUserConnectionInfo } from '../../../hooks'
import { useConnectedChainAndWalletLogo } from '../../../hooks/useLogos'
import { useDeriveAppType } from '../../../providers/utils/connectors'
import { PstlModalTheme } from '../../../theme'
import { ConnectorEnhanced } from '../../../types'
import { BaseModalProps, ModalId } from '../common/types'
import { WalletChainLogos } from './WalletChainLogos'
import {
  AccountColumnContainer,
  AccountModalButton,
  AccountText,
  AddressAndBalanceColumnContainer,
  FooterActionButtonsRow,
  Icon,
  WalletAndNetworkRowContainer
} from './styled'

type PstlAccountModalProps = ModalPropsCtrlState['root'] &
  ModalPropsCtrlState['account'] &
  Pick<BaseModalProps, 'errorOptions'>

function AccountModalContent({ closeModalOnConnect, errorOptions }: PstlAccountModalProps) {
  const modalCallbacks = usePstlWeb3Modal()
  const userConnectionInfo = useUserConnectionInfo()
  const {
    disconnect: { disconnectAsync }
  } = useConnectDisconnect({
    connect: {
      onSuccess() {
        closeModalOnConnect && modalCallbacks.close()
      }
    },
    disconnect: {
      onSuccess() {
        modalCallbacks.close()
      }
    }
  })

  const appType = useDeriveAppType()
  const { isUnsupportedChain, showNetworkButton, isNonFrameWalletApp } = useMemo(() => {
    const isUnsupportedChain =
      userConnectionInfo.chain?.unsupported ||
      !userConnectionInfo.supportedChains.some((chain) => chain.id === userConnectionInfo.chain?.id)
    const supportsSeveralChains = (userConnectionInfo?.supportedChains?.length || 0) > 1

    return {
      isUnsupportedChain,
      showNetworkButton: supportsSeveralChains || isUnsupportedChain,
      isNonFrameWalletApp: appType === 'DAPP' || appType === 'TEST_FRAMEWORK_IFRAME'
    }
  }, [appType, userConnectionInfo.chain?.id, userConnectionInfo.chain?.unsupported, userConnectionInfo.supportedChains])

  const isSmallerScreen = useIsSmallMediaWidth()

  const { chain: chainLogo, wallet: walletLogo } = useConnectedChainAndWalletLogo()

  const [isCopied, onCopy] = useCopyClipboard(1500)
  const onExplorer = useCallback(() => {
    if (
      typeof globalThis?.window === 'undefined' ||
      !userConnectionInfo?.chain?.blockExplorers?.default ||
      !userConnectionInfo?.address
    )
      return

    const explorerUrl = userConnectionInfo.chain.blockExplorers.default.url + '/address/' + userConnectionInfo.address
    window.open(explorerUrl, '_blank')
  }, [userConnectionInfo?.chain?.blockExplorers?.default, userConnectionInfo?.address])

  const theme = useModalTheme()

  return (
    <AccountColumnContainer width="100%" gap="1rem">
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
      <AddressAndBalanceColumnContainer
        cursor="pointer"
        borderRadius="1rem"
        padding="1em"
        backgroundColor={theme?.connection?.button?.main?.background?.default}
        border={theme?.account?.container?.secondary?.border?.border}
      >
        <Column>
          <Row
            justifyContent="flex-start"
            gap="10px"
            style={{ cursor: 'pointer', zIndex: 1 }}
            title={userConnectionInfo.address}
            onClick={() => onCopy(userConnectionInfo?.address || '')}
          >
            <AccountText id="pstl-web3-modal-address-text" node="header" css="text-transform: initial;">
              {userConnectionInfo.address
                ? isCopied
                  ? 'Copied!'
                  : truncateAddress(userConnectionInfo.address, { type: 'long' })
                : 'Disconnected'}
            </AccountText>
            {theme?.account?.icons?.copy && <Icon src={theme?.account?.icons?.copy?.url} />}
          </Row>
          <Row id={`${ModalId.ACCOUNT}__balance-text`}>
            <AccountText node="subHeader">Balance:</AccountText>
            <AccountText node="subHeader" title={userConnectionInfo.balance.data?.formatted || '0'} marginLeft={'5px'}>
              {Number(userConnectionInfo.balance.data?.formatted || 0).toLocaleString([], {
                maximumSignificantDigits: 4
              })}{' '}
              {userConnectionInfo.balance.data?.symbol || 'N/A'}
            </AccountText>
          </Row>
        </Column>
        <FooterActionButtonsRow
          marginTop={'1rem'}
          justifyContent={'space-evenly'}
          gap="2rem"
          style={{ zIndex: errorOptions?.show ? 0 : 1 }}
        >
          <AccountModalButton
            id={`${ModalId.ACCOUNT}__explorer-button`}
            modal="account"
            node="main"
            connected={false}
            padding="0.6rem"
            onClick={() => onExplorer()}
          >
            {`${isSmallerScreen ? '' : 'View on '}Explorer`}
          </AccountModalButton>
        </FooterActionButtonsRow>
      </AddressAndBalanceColumnContainer>
      {/* Wallet & Network Row */}
      <WalletAndNetworkRowContainer
        cursor={isNonFrameWalletApp ? 'pointer' : 'initial'}
        width="100%"
        padding="1em"
        border={theme?.account?.container?.main?.border?.border}
        borderRadius={theme?.account?.container?.main?.border?.radius}
        backgroundColor={
          isUnsupportedChain ? theme?.base?.background?.error : theme?.connection?.button?.main?.background?.default
        }
      >
        <Column width="100%" maxWidth={400}>
          {/* Wallet & Network Row */}
          <Row
            id={`${ModalId.ACCOUNT}__wallets-button`}
            fontSize="unset"
            height="auto"
            minHeight={82}
            width="100%"
            marginRight="1rem"
            onClick={() => isNonFrameWalletApp && modalCallbacks.open({ route: 'ConnectWallet' })}
          >
            <Column width="100%" gap="0.3rem">
              <AccountText
                id="pstl-web3-modal-wallet-text"
                node="main"
                display="inline-flex"
                alignItems="center"
                width="auto"
              >
                {theme?.account?.icons?.wallet?.url && <Icon src={theme?.account?.icons?.wallet?.url} />}
                Wallet:{' '}
                <AccountText
                  node="main"
                  cursor="pointer"
                  fontSize="inherit"
                  fontWeight={700}
                  display="inline-flex"
                  alignItems="center"
                  padding={0}
                  marginLeft="0.5rem"
                >
                  {(userConnectionInfo.connector as ConnectorEnhanced<any, any>)?.customName ||
                    userConnectionInfo.connector?.name}
                </AccountText>
              </AccountText>
              <AccountText
                id="pstl-web3-modal-wallet-text"
                node="main"
                display="inline-flex"
                alignItems="center"
                width="auto"
              >
                {theme?.account?.icons?.network?.url && <Icon src={theme?.account?.icons?.network?.url} />}
                Network:{' '}
                <AccountText
                  node="main"
                  fontSize="inherit"
                  display="inline-flex"
                  alignItems="center"
                  padding={0}
                  marginLeft="0.5rem"
                >
                  {userConnectionInfo.chain?.name || userConnectionInfo.chain?.id || 'Unknown network'}
                  {isUnsupportedChain && <small className="unsupported-small-text">[unsupported]</small>}
                </AccountText>
              </AccountText>
            </Column>
          </Row>
          {/* Switch Network & Disconnect Buttons */}
          <Row id={`${ModalId.ACCOUNT}__network-disconnect-buttons`} width="100%" marginTop="1rem" gap="1rem">
            {showNetworkButton && (
              <AccountModalButton
                modal="account"
                node="main"
                id={`${ModalId.ACCOUNT}__network-button`}
                connected={false}
                padding="0.6rem"
                onClick={() => modalCallbacks.open({ route: 'SelectNetwork' })}
              >
                Switch Network
              </AccountModalButton>
            )}
            {isNonFrameWalletApp && (
              <AccountModalButton
                modal="account"
                node="alternate"
                id={`${ModalId.ACCOUNT}__disconnect-button`}
                connected={false}
                padding="0.6rem"
                onClick={() => disconnectAsync()}
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
