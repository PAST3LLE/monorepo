import { Column, Row } from '@past3lle/components'
import { useCopyClipboard, useIsSmallMediaWidth } from '@past3lle/hooks'
import { truncateAddress } from '@past3lle/utils'
import React, { memo, useCallback, useMemo } from 'react'
import { useTheme } from 'styled-components'

import { CHAIN_IMAGES } from '../../../constants'
import { ModalPropsCtrlState } from '../../../controllers/types/controllerTypes'
import { useConnectDisconnect, usePstlWeb3Modal, useUserConnectionInfo } from '../../../hooks'
import { PstlModalTheme } from '../../../theme'
import { ConnectorEnhanced } from '../../../types'
import { trimAndLowerCase } from '../../../utils'
import { ModalButton } from '../common/styled'
import { BaseModalProps, ModalId } from '../common/types'
import {
  AccountAddressText,
  AccountBalanceText,
  AccountBottomColumnContainer,
  AccountColumnContainer,
  AccountMainText,
  AccountModalButton,
  FooterActionButtonsRow
} from './styled'

type PstlAccountModalProps = ModalPropsCtrlState['root'] &
  ModalPropsCtrlState['account'] &
  Pick<BaseModalProps, 'errorOptions'>

function AccountModalContent({ closeModalOnConnect, connectorDisplayOverrides, errorOptions }: PstlAccountModalProps) {
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

  const showNetworkButton = useMemo(() => {
    const supportsSeveralChains = (userConnectionInfo?.supportedChains?.length || 0) > 1
    const currentChainUnsupported = !userConnectionInfo.supportedChains.some(
      (suppChain) => suppChain.id === userConnectionInfo.chain?.id
    )

    return supportsSeveralChains || currentChainUnsupported
  }, [userConnectionInfo.chain?.id, userConnectionInfo.supportedChains])

  const isSmallerScreen = useIsSmallMediaWidth()
  const [logo, chainLogo] = useMemo(
    () => [
      (
        connectorDisplayOverrides?.[trimAndLowerCase(userConnectionInfo.connector?.id)] ||
        connectorDisplayOverrides?.[trimAndLowerCase(userConnectionInfo.connector?.name)]
      )?.logo,
      userConnectionInfo?.chain?.id ? CHAIN_IMAGES?.[userConnectionInfo.chain.id] : undefined
    ],
    [
      connectorDisplayOverrides,
      userConnectionInfo.chain?.id,
      userConnectionInfo.connector?.id,
      userConnectionInfo.connector?.name
    ]
  )

  const [isCopied, onCopy] = useCopyClipboard(3000)
  const onExplorer = useCallback(() => {
    if (
      typeof globalThis?.window === undefined ||
      !userConnectionInfo?.chain?.blockExplorers?.default ||
      !userConnectionInfo?.address
    )
      return

    const explorerUrl = userConnectionInfo.chain.blockExplorers.default.url + '/address/' + userConnectionInfo.address
    window.open(explorerUrl, '_blank')
  }, [userConnectionInfo?.chain?.blockExplorers?.default, userConnectionInfo?.address])

  const theme = useModalTheme()

  return (
    <AccountColumnContainer width="100%">
      <Row width="100%">
        <Column width="100%" maxWidth={400}>
          <ModalButton
            id={`${ModalId.ACCOUNT}__wallets-button`}
            connected={false}
            width="100%"
            marginRight="1rem"
            backgroundColor={
              userConnectionInfo.chain?.unsupported
                ? theme?.account?.balanceAndAddressContainer?.background?.unsupported
                : theme?.connection?.button?.background?.background
            }
            onClick={() => modalCallbacks.open({ route: 'ConnectWallet' })}
          >
            <Column width={'100%'}>
              <AccountMainText display="inline-flex" alignItems="center" width="auto">
                Wallet:{' '}
                <AccountMainText display={'inline-flex'} alignItems="center" padding={0} marginLeft="0.5rem">
                  {(userConnectionInfo.connector as ConnectorEnhanced<any, any>)?.customName ||
                    userConnectionInfo.connector?.name}
                </AccountMainText>
              </AccountMainText>
              <AccountMainText display="inline-flex" alignItems="center" width="auto">
                Network:{' '}
                <AccountMainText display={'inline-flex'} alignItems="center" padding={0} marginLeft="0.5rem">
                  {userConnectionInfo.chain?.name || 'Unknown network'}
                  {userConnectionInfo.chain?.unsupported && (
                    <small className="unsupported-small-text">[unsupported]</small>
                  )}
                </AccountMainText>
              </AccountMainText>
            </Column>
          </ModalButton>
          <Row width="100%" marginTop="1rem" gap="1rem">
            {showNetworkButton && (
              <AccountModalButton
                backgroundColor={theme?.account?.button?.switchNetwork?.background?.background}
                color={theme?.connection?.button?.font?.color}
                id={`${ModalId.ACCOUNT}__network-button`}
                connected={false}
                padding="0.6rem"
                onClick={() => modalCallbacks.open({ route: 'SelectNetwork' })}
              >
                Switch Network
              </AccountModalButton>
            )}
            <AccountModalButton
              backgroundColor={theme?.account?.button?.disconnect?.background?.background}
              color={theme?.connection?.button?.font?.color}
              id={`${ModalId.ACCOUNT}__disconnect-button`}
              connected={false}
              padding="0.6rem"
              onClick={() => disconnectAsync()}
            >
              Disconnect
            </AccountModalButton>
          </Row>
        </Column>
        <Row width="100%">
          {logo && (
            <img
              title={'Provider image'}
              src={logo}
              style={{
                marginLeft: 'auto',
                maxWidth: 110,
                borderRadius: '5rem',
                overflow: 'hidden',
                zIndex: 1
              }}
            />
          )}
          {chainLogo && (
            <img src={chainLogo} style={{ marginLeft: logo ? -27.5 : 'auto', maxWidth: 110, borderRadius: '5rem' }} />
          )}
        </Row>
      </Row>
      <br />
      <AccountBottomColumnContainer
        borderRadius="1rem"
        padding="1em"
        backgroundColor={theme?.connection?.button?.background?.background}
      >
        <Row justifyContent="space-between" title={userConnectionInfo.address}>
          <AccountAddressText onClick={() => onCopy(userConnectionInfo?.address || '')} style={{ cursor: 'pointer' }}>
            {userConnectionInfo.address
              ? truncateAddress(userConnectionInfo.address, { type: 'long' })
              : 'Disconnected'}
          </AccountAddressText>
        </Row>
        <Row>
          <AccountBalanceText>Balance:</AccountBalanceText>
          <AccountBalanceText title={userConnectionInfo.balance.data?.formatted || '0'} marginLeft={'5px'}>
            {Number(userConnectionInfo.balance.data?.formatted || 0).toLocaleString([], {
              maximumSignificantDigits: 4
            })}{' '}
            {userConnectionInfo.balance.data?.symbol || 'N/A'}
          </AccountBalanceText>
        </Row>
        <FooterActionButtonsRow
          marginTop={'1rem'}
          justifyContent={'space-evenly'}
          gap="2rem"
          style={{ zIndex: errorOptions?.show ? 0 : 1 }}
        >
          <AccountModalButton
            backgroundColor={theme?.account?.button?.copy?.background?.background}
            color={theme?.connection?.button?.font?.color}
            id={`${ModalId.ACCOUNT}__copy-button`}
            connected={isCopied}
            onClick={() => onCopy(userConnectionInfo?.address || '')}
          >
            {isCopied ? 'Copied!' : `Copy ${isSmallerScreen ? '' : 'Address'}`}
          </AccountModalButton>
          <AccountModalButton
            backgroundColor={theme?.account?.button?.explorer?.background?.background}
            color={theme?.connection?.button?.font?.color}
            id={`${ModalId.ACCOUNT}__explorer-button`}
            connected={false}
            onClick={() => onExplorer()}
          >
            {`${isSmallerScreen ? '' : 'View on '}Explorer`}
          </AccountModalButton>
        </FooterActionButtonsRow>
      </AccountBottomColumnContainer>
    </AccountColumnContainer>
  )
}

function useModalTheme(): PstlModalTheme['modals'] {
  const theme = useTheme()
  return theme.modals
}

export const AccountModal = memo(AccountModalContent)
