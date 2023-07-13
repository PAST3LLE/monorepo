import { Column, Row } from '@past3lle/components'
import { useCopyClipboard, useIsSmallMediaWidth } from '@past3lle/hooks'
import { truncateAddress } from '@past3lle/utils'
import React, { memo, useCallback } from 'react'

import { CHAIN_IMAGES } from '../../../constants'
import { ModalPropsCtrlState } from '../../../controllers/types/controllerTypes'
import { useConnectDisconnect, usePstlWeb3Modal, useUserConnectionInfo } from '../../../hooks'
import { ConnectorEnhanced } from '../../../types'
import { trimAndLowerCase } from '../../../utils'
import { ModalButton } from '../common/styled'
import { BaseModalProps } from '../common/types'
import { AccountColumnContainer, AccountModalButton, AccountText, FooterActionButtonsRow } from './styled'

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

  const isSmallerScreen = useIsSmallMediaWidth()
  const logo = (
    connectorDisplayOverrides?.[trimAndLowerCase(userConnectionInfo.connector?.id)] ||
    connectorDisplayOverrides?.[trimAndLowerCase(userConnectionInfo.connector?.name)]
  )?.logo
  const chainLogo = userConnectionInfo.chain?.id && CHAIN_IMAGES?.[userConnectionInfo.chain.id]

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

  return (
    <AccountColumnContainer width="100%">
      <Row width="100%">
        <ModalButton
          connected={false}
          width="100%"
          maxWidth="400px"
          marginRight="1rem"
          onClick={() => modalCallbacks.open({ route: 'ConnectWallet' })}
        >
          <Column width={'100%'}>
            <AccountText display="inline-flex" alignItems="center" width="auto">
              Wallet:{' '}
              <AccountText fontWeight={500} display={'inline-flex'} alignItems="center" padding={0} marginLeft="0.5rem">
                {(userConnectionInfo.connector as ConnectorEnhanced<any, any>)?.customName ||
                  userConnectionInfo.connector?.name}
              </AccountText>
            </AccountText>
            <AccountText display="inline-flex" alignItems="center" width="auto">
              Network:{' '}
              <AccountText fontWeight={500} display={'inline-flex'} alignItems="center" padding={0} marginLeft="0.5rem">
                {userConnectionInfo.chain?.name || 'Unknown network'}
              </AccountText>
            </AccountText>
          </Column>
        </ModalButton>
        {logo && (
          <img
            src={logo}
            style={{
              marginLeft: 'auto',
              maxWidth: 110,
              borderRadius: '5rem',
              overflow: 'hidden'
            }}
          />
        )}
        {chainLogo && <img src={chainLogo} style={{ marginLeft: -27.5, maxWidth: 110, borderRadius: '5rem' }} />}
      </Row>
      <br />
      <Column backgroundColor={'#370937c9'} borderRadius="1rem" padding="1rem">
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
          gap="1rem"
          style={{ zIndex: errorOptions?.show ? 0 : 1 }}
        >
          <AccountModalButton connected={isCopied} onClick={() => onCopy(userConnectionInfo?.address || '')}>
            {isCopied ? 'Copied!' : `Copy ${isSmallerScreen ? '' : 'Address'}`}
          </AccountModalButton>
          <AccountModalButton connected={false} onClick={() => onExplorer()}>
            {`${isSmallerScreen ? '' : 'View on '}Explorer`}
          </AccountModalButton>
          <AccountModalButton connected={false} onClick={() => disconnectAsync()}>
            Disconnect
          </AccountModalButton>
        </FooterActionButtonsRow>
      </Column>
    </AccountColumnContainer>
  )
}

export const AccountModal = memo(AccountModalContent)
