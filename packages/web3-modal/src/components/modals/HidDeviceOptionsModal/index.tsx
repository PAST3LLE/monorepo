import { Column, InfoCircle, MouseoverTooltip, Row, SpinnerCircle, useSelect } from '@past3lle/components'
import { useDebounce } from '@past3lle/hooks'
import { BLACK_TRANSPARENT, OFF_WHITE } from '@past3lle/theme'
import { devError } from '@past3lle/utils'
import type { LedgerHIDConnector } from '@past3lle/wagmi-connectors'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'
import { formatEther } from 'viem'
import { Address, useSwitchNetwork } from 'wagmi'

import { ModalPropsCtrlState } from '../../../controllers/types/controllerTypes'
import { useGetChainLogoCallback, usePstlWeb3Modal, usePstlWeb3ModalStore, useUserConnectionInfo } from '../../../hooks'
import { NoChainLogo } from '../../NoChainLogo'
import { AccountModalButton, AccountText, FooterActionButtonsRow, ModalColumnContainer } from '../AccountModal/styled'
import { ConnectorOption } from '../ConnectionModal/ConnectorOption'
import { BaseModalProps, ModalId } from '../common/types'
import {
  HidModalAddresseRow,
  HidModalAddressesList,
  HidModalContainer,
  HidModalHeaderRow,
  HidModalTextInput,
  HidModalWalletsWrapper,
  PathSelectAndInputContainer
} from './styleds'

const SUPPORTED_BIP_DERIVATION_PATHS = [
  // Ledger Live
  "m/44'/60'/*'/0/0",
  // Ledger Legacy
  "m/44'/60'/*'/0",
  // BIP44 Standard
  "m/44'/60'/0'/0/*"
]

type PstlHidDeviceModalProps = ModalPropsCtrlState['root'] &
  ModalPropsCtrlState['hidDeviceOptions'] &
  Pick<BaseModalProps, 'errorOptions'>

const PAGINATION_AMT = 5
const CHAIN_IMAGE_STYLES = { width: 20, marginLeft: '0.2rem', borderRadius: '30%' }

function HidDeviceOptionsContent({ errorOptions }: PstlHidDeviceModalProps) {
  const { close } = usePstlWeb3Modal()
  const { updateModalProps } = usePstlWeb3ModalStore()
  const { address, chain, supportedChains } = useUserConnectionInfo()
  const getChainLogo = useGetChainLogoCallback()
  const currChainLogo = getChainLogo(chain?.id)
  const { switchNetworkAsync } = useSwitchNetwork()
  const chainId = chain?.id

  const [accountsAndBalances, setAccountsAndBalances] = useState<{ address: string; balance: string | undefined }[]>([])

  const [loading, setLoading] = useState(false)
  const [paginationIdx, setPaginationIdx] = useState(PAGINATION_AMT)

  const { connector: hidConnector } = useUserConnectionInfo()

  const [path, setPath] = useState<string | null>(SUPPORTED_BIP_DERIVATION_PATHS[0])
  const dbPath = useDebounce(path, 500)
  const [isCustomPath, setCustom] = useState(false)

  const setHidError = useCallback(
    (error: unknown) => {
      devError(error)
      updateModalProps({
        hidDeviceOptions: {
          error:
            error instanceof Error
              ? error
              : typeof error === 'string'
              ? new Error(error)
              : new Error('Unknown error occured!')
        }
      })
    },
    [updateModalProps]
  )

  const { handleSelectAccount, resetAndConnectProvider, getAccount, getAccounts } = useMemo(() => {
    const replacedDbPath = dbPath?.replace('*', '0') ?? null

    return {
      handleSelectAccount: async (sPath: string) => {
        const hid = hidConnector as LedgerHIDConnector
        try {
          _isConnectedOrThrow(hid)
          await hid?.setAccount(sPath)
          close()
        } catch (error) {
          setHidError(error)
        }
      },
      resetAndConnectProvider: async () => {
        const hid = hidConnector as LedgerHIDConnector
        setPaginationIdx(PAGINATION_AMT)
        setAccountsAndBalances([])
        if (replacedDbPath) {
          try {
            _isConnectedOrThrow(hid)
            await hid?.disconnect()
            await hid?.connect({ chainId }, { path: replacedDbPath, reset: true })
          } catch (error) {
            setHidError(error)
          }
        }
      },
      getAccount: async () => {
        if (!replacedDbPath) return
        const hid = hidConnector as LedgerHIDConnector
        try {
          _isConnectedOrThrow(hid)
          await hid.getAccount(replacedDbPath)
        } catch (error) {
          setHidError(error)
        }
      },
      getAccounts: async () => {
        if (!dbPath) return null
        const hid = hidConnector as LedgerHIDConnector

        try {
          _isConnectedOrThrow(hid)
          setLoading(true)

          const accountsAndBalances: { address: Address; balance: string | undefined }[] = []
          for (let i = paginationIdx - PAGINATION_AMT; i < paginationIdx; i++) {
            const replacedPath = dbPath.replace('*', i.toString())
            const acct = await hid.getAccount(replacedPath)
            const bal = await hid.provider?.getBalance(acct)
            accountsAndBalances.push({ address: acct, balance: bal ? formatEther(BigInt(bal.toString())) : '0' })
            continue
          }

          setAccountsAndBalances((state) => [...state, ...accountsAndBalances])
          setPaginationIdx((state) => state + PAGINATION_AMT)
        } catch (error) {
          setHidError(error)
          setAccountsAndBalances([])
        } finally {
          return setLoading(false)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, close, dbPath, hidConnector, paginationIdx])

  const {
    Component: Selector,
    store: [selection, setSelection]
  } = useSelect({
    options: SELECTOR_OPTIONS,
    defaultValue: SELECTOR_OPTIONS[0].value,
    name: 'HID Derivation Paths',
    callback: (selection) => {
      setCustom(false)
      setPath(selection)
      resetAndConnectProvider()
    }
  })

  useEffect(() => {
    async function resetAndGetAccount() {
      try {
        // reset pagination
        await resetAndConnectProvider()
        // get account
        await getAccount()
      } catch (error) {
        setHidError(error)
      }
    }

    if (!dbPath || !chainId) return

    const samePath = SUPPORTED_BIP_DERIVATION_PATHS.find((val) => val === dbPath)
    if (isCustomPath && samePath) setSelection(samePath)

    resetAndGetAccount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbPath, chainId, isCustomPath])

  const { modals: theme } = useTheme()

  return (
    <ModalColumnContainer width="100%" color={'ghostwhite'} layout="Other">
      {/* Address and Balance Row */}
      <HidModalContainer
        borderRadius="1rem"
        padding="1em"
        backgroundColor={theme?.connection?.button?.background?.background}
        border={theme?.account?.container?.walletAndNetwork?.border?.border}
      >
        <Column flex="0 1 100%">
          {hidConnector && (
            <Column maxHeight={115} height="auto" overflow={'auto'}>
              <AccountText type="main">
                Network:{' '}
                <AccountText type="balance" display="inline-flex" justifyContent={'center'}>
                  {chain?.name || chain?.id || 'disconnected'}{' '}
                  {currChainLogo ? (
                    <img src={currChainLogo} style={CHAIN_IMAGE_STYLES} />
                  ) : (
                    <NoChainLogo style={CHAIN_IMAGE_STYLES} />
                  )}
                </AccountText>
              </AccountText>
              <HidModalWalletsWrapper view="grid" width="auto">
                {supportedChains.map((sChain) => {
                  if (!switchNetworkAsync || chain?.id === sChain.id) return null
                  const chainLogo = getChainLogo(sChain.id)
                  return (
                    <ConnectorOption
                      // keys & ids
                      optionType="chain"
                      optionValue={sChain.id}
                      key={sChain.id}
                      // data props
                      callback={async () => switchNetworkAsync(sChain.id)}
                      modalView={'grid'}
                      connected={false}
                      connector={hidConnector as LedgerHIDConnector}
                      label={sChain.name}
                      logo={chainLogo ? <img src={chainLogo} /> : <NoChainLogo />}
                    />
                  )
                })}
              </HidModalWalletsWrapper>
            </Column>
          )}
          <Row justifyContent="flex-start" gap="10px" style={{ zIndex: 1 }} title="derivation-path">
            <AccountText id="pstl-web3-modal-address-text" type="main">
              Select a derivation path
            </AccountText>
          </Row>
          <Row id={`${ModalId.ACCOUNT}__balance-text`}>
            <AccountText type="balance">Current Path:</AccountText>
            <AccountText type="balance" title="current-path" marginLeft={'5px'}>
              {selection}
            </AccountText>
          </Row>
        </Column>
        {/* PATH SELECTOR / INPUT */}
        <PathSelectAndInputContainer marginTop={'1rem'} width="100%" gap="1rem" flexWrap="wrap">
          <Column flex="1 1 220px">
            <AccountText fontSize="0.8em" marginBottom="0.25rem" type="balance">
              PRESET PATH
            </AccountText>
            <Selector arrowStrokeColor="ghostwhite" arrowSize={30} />
          </Column>
          <Row flex="1 1 350px" width="auto">
            <Column width="100%">
              <AccountText fontSize="0.8em" marginBottom="0.25rem" type="balance">
                OR CUSTOM ETH PATH{' '}
                <MouseoverTooltip
                  text="Set your own ETH derivation path where * indicates the index of user accounts. e.g m/44'/60'/*'/0/0"
                  placement="top"
                  styles={{
                    fontFamily: 'monospace, arial, system-ui',
                    fontSize: '0.75em',
                    color: theme?.base?.font?.color || OFF_WHITE,
                    border: 'none',
                    backgroundColor: theme?.base?.background?.background || BLACK_TRANSPARENT
                  }}
                >
                  <InfoCircle label="?" size={15} color="black" marginLeft="3px" />
                </MouseoverTooltip>
              </AccountText>
              <HidModalTextInput
                type="text"
                value={isCustomPath ? path ?? '' : ''}
                placeholder={'m/TYPE/PATH/HERE'}
                onChange={(e) => {
                  setCustom(true)
                  setPath(e.target.value)
                }}
              />
            </Column>
          </Row>
        </PathSelectAndInputContainer>
        {/* ADDRESSES TABLE / LIST */}
        <Column margin="1rem 0 0">
          <Row justifyContent="flex-start" gap="10px" style={{ zIndex: 1 }} title="derivation-path">
            <AccountText id="pstl-web3-modal-address-text" type="main">
              Scan and select an account
            </AccountText>
          </Row>
          <Row id={`${ModalId.ACCOUNT}__balance-text`}>
            <AccountText type="balance">Current Account:</AccountText>
            <AccountText type="balance" title="current-path" marginLeft={'5px'}>
              {address || 'Disconnected'}
            </AccountText>
          </Row>
        </Column>
        <HidModalAddressesList width="100%" gap="0" margin="1rem 0" zIndex={errorOptions?.show ? 0 : 1}>
          <HidModalHeaderRow padding="0rem 0.25rem">
            <AccountText type="balance" as="strong">
              Address
            </AccountText>
            <AccountText type="balance" as="strong">
              Path
            </AccountText>
            <AccountText type="balance" as="strong">
              Balance
            </AccountText>
          </HidModalHeaderRow>
          {accountsAndBalances?.length ? (
            accountsAndBalances.map(({ address: acct, balance }, idx) => {
              const sPath = dbPath?.replace('*', idx.toString())
              return (
                <HidModalAddresseRow
                  key={idx + '_' + acct}
                  onClick={() => sPath && handleSelectAccount(sPath)}
                  padding="0.15rem 0.25rem"
                >
                  <strong>{acct}</strong>
                  <strong>{sPath}</strong>
                  <strong>{balance || 0}</strong>
                </HidModalAddresseRow>
              )
            })
          ) : (
            <Row padding="0.15rem 0.25rem">
              <span style={{ width: '100%', textAlign: 'center', fontSize: '0.8rem', marginTop: '1rem' }}>
                Click below to query accounts for this path
              </span>
            </Row>
          )}
        </HidModalAddressesList>
        {/* SHOW ACCOUNTS CTA */}
        <FooterActionButtonsRow
          marginTop={'1rem'}
          justifyContent={'space-evenly'}
          gap="2rem"
          style={{ zIndex: errorOptions?.show ? 0 : 1 }}
        >
          <AccountModalButton
            type="explorer"
            id={`${ModalId.ACCOUNT}__explorer-button`}
            connected={false}
            padding="0.6rem"
            onClick={getAccounts}
            disabled={loading}
          >
            {loading ? (
              <>
                Fetching... <SpinnerCircle />
              </>
            ) : paginationIdx === PAGINATION_AMT ? (
              'Scan Accounts'
            ) : (
              'Load more'
            )}
          </AccountModalButton>
        </FooterActionButtonsRow>
      </HidModalContainer>
    </ModalColumnContainer>
  )
}

const SELECTOR_OPTIONS = [
  { value: SUPPORTED_BIP_DERIVATION_PATHS[0], label: 'Ledger Live - ' + SUPPORTED_BIP_DERIVATION_PATHS[0] },
  {
    value: SUPPORTED_BIP_DERIVATION_PATHS[1],
    label: 'Ledger Legacy - ' + SUPPORTED_BIP_DERIVATION_PATHS[1]
  },
  {
    value: SUPPORTED_BIP_DERIVATION_PATHS[2],
    label: 'BIP44 Standard - ' + SUPPORTED_BIP_DERIVATION_PATHS[2]
  }
]

function _isConnectedOrThrow(hid: LedgerHIDConnector | undefined) {
  if (!hid)
    throw new Error(
      'No HID connector detected. Please check that device is plugged in, unlocked, and that the Ethereum app is open.'
    )
}

export default memo(HidDeviceOptionsContent)
