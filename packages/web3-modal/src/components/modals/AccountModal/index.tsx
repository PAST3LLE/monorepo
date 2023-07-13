import { Column, Row } from '@past3lle/components'
import { useCopyClipboard, useIsSmallMediaWidth } from '@past3lle/hooks'
import { truncateAddress } from '@past3lle/utils'
import React, { memo, useCallback, useMemo } from 'react'
import { useTheme } from 'styled-components'

import { CHAIN_IMAGES } from '../../../constants'
import { ModalPropsCtrlState } from '../../../controllers/types/controllerTypes'
import { useConnectDisconnect, usePstlWeb3Modal, useUserConnectionInfo } from '../../../hooks'
import BaseTheme from '../../../theme/baseTheme'
import { ConnectorEnhanced } from '../../../types'
import { trimAndLowerCase } from '../../../utils'
import { ModalButton } from '../common/styled'
import { BaseModalProps } from '../common/types'
import {
  AccountBottomColumnContainer,
  AccountColumnContainer,
  AccountModalButton,
  AccountText,
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

  const theme = useTheme()

  return (
    <AccountColumnContainer width="100%">
      <Row width="100%">
        <Column width="100%" maxWidth={400}>
          <ModalButton
            connected={false}
            width="100%"
            marginRight="1rem"
            backgroundColor={
              userConnectionInfo.chain?.unsupported
                ? '#7f1d1db0'
                : theme?.modals?.connection?.button?.backgroundColor ||
                  BaseTheme.modes.DEFAULT.modals.connection.button.backgroundColor
            }
            onClick={() => modalCallbacks.open({ route: 'ConnectWallet' })}
          >
            <Column width={'100%'}>
              <AccountText display="inline-flex" alignItems="center" width="auto">
                Wallet:{' '}
                <AccountText
                  fontWeight={500}
                  display={'inline-flex'}
                  alignItems="center"
                  padding={0}
                  marginLeft="0.5rem"
                >
                  {(userConnectionInfo.connector as ConnectorEnhanced<any, any>)?.customName ||
                    userConnectionInfo.connector?.name}
                </AccountText>
              </AccountText>
              <AccountText display="inline-flex" alignItems="center" width="auto">
                Network:{' '}
                <AccountText
                  fontWeight={500}
                  display={'inline-flex'}
                  alignItems="center"
                  padding={0}
                  marginLeft="0.5rem"
                >
                  {userConnectionInfo.chain?.name || 'Unknown network'}
                  {userConnectionInfo.chain?.unsupported && (
                    <small className="unsupported-small-text">[unsupported]</small>
                  )}
                </AccountText>
              </AccountText>
            </Column>
          </ModalButton>
          <Row width="100%" marginTop="1rem" gap="1rem">
            {showNetworkButton && (
              <AccountModalButton
                connected={false}
                padding="0.6rem"
                onClick={() => modalCallbacks.open({ route: 'SelectNetwork' })}
              >
                Switch Network
              </AccountModalButton>
            )}
            <AccountModalButton
              connected={false}
              padding="0.6rem"
              onClick={() => disconnectAsync()}
              backgroundColor={'#7b2727b0'}
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
                overflow: 'hidden'
              }}
            />
          )}
          {chainLogo && (
            <img src={chainLogo} style={{ marginLeft: logo ? -27.5 : 'auto', maxWidth: 110, borderRadius: '5rem' }} />
          )}
        </Row>
      </Row>
      <br />
      <AccountBottomColumnContainer borderRadius="1rem" padding="1em">
        <Row justifyContent="space-between" title={userConnectionInfo.address}>
          <AccountText
            fontWeight={500}
            fontSize={'1.2em'}
            onClick={() => onCopy(userConnectionInfo?.address || '')}
            style={{ cursor: 'pointer' }}
          >
            {userConnectionInfo.address
              ? truncateAddress(userConnectionInfo.address, { type: 'long' })
              : 'Disconnected'}
          </AccountText>
        </Row>
        <Row>
          <AccountText>Balance:</AccountText>
          <AccountText title={userConnectionInfo.balance.data?.formatted || '0'}>
            {Number(userConnectionInfo.balance.data?.formatted || 0).toLocaleString([], {
              maximumSignificantDigits: 4
            })}{' '}
            {userConnectionInfo.balance.data?.symbol || 'N/A'}
          </AccountText>
        </Row>
        <FooterActionButtonsRow
          marginTop={'1rem'}
          justifyContent={'space-evenly'}
          gap="2rem"
          style={{ zIndex: errorOptions?.show ? 0 : 1 }}
        >
          <AccountModalButton connected={isCopied} onClick={() => onCopy(userConnectionInfo?.address || '')}>
            {isCopied ? 'Copied!' : `Copy ${isSmallerScreen ? '' : 'Address'}`}
          </AccountModalButton>
          <AccountModalButton connected={false} onClick={() => onExplorer()}>
            {`${isSmallerScreen ? '' : 'View on '}Explorer`}
          </AccountModalButton>
        </FooterActionButtonsRow>
      </AccountBottomColumnContainer>
    </AccountColumnContainer>
  )
}

export const AccountModal = memo(AccountModalContent)
