import { Column, ColumnCenter, Row, SpinnerCircle } from '@past3lle/components'
import { useDebounce, useIsExtraSmallMediaWidth } from '@past3lle/hooks'
import { devError } from '@past3lle/utils'
import type { LedgerHIDConnector } from '@past3lle/wagmi-connectors'
import React, { CSSProperties, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'
import { formatEther } from 'viem'
import { Address, useSwitchNetwork } from 'wagmi'

import { ModalPropsCtrlState } from '../../../controllers/types/controllerTypes'
import { useGetChainLogoCallback, usePstlWeb3Modal, useUserConnectionInfo } from '../../../hooks'
import { NoChainLogo } from '../../NoChainLogo'
import { AccountColumnContainer, AccountModalButton, AccountText, FooterActionButtonsRow } from '../AccountModal/styled'
import { ConnectorOption } from '../ConnectionModal/ConnectorOption'
import { BaseModalProps, ModalId } from '../common/types'
import { HidModalContainer, HidModalWalletsWrapper } from './styleds'

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

const INPUT_STYLES = {
  fontSize: '1rem',
  fontWeight: 100,
  padding: '0.5rem',
  backgroundColor: 'transparent',
  color: 'ghostwhite',
  outline: 'none',
  border: '1px solid ghostwhite',
  borderRadius: 5,
  cursor: 'pointer'
}
const PAGINATION_AMT = 5
const CHAIN_IMAGE_STYLES = { width: 20, marginLeft: '0.2rem', borderRadius: '30%' }

function HidDeviceOptionsContent({ errorOptions }: PstlHidDeviceModalProps) {
  const { close } = usePstlWeb3Modal()
  const { chain, supportedChains } = useUserConnectionInfo()
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
  const [, setPathAddressMap] = useState(new Map<string, string>())

  const { handleSelectAccount, resetAndConnectProvider, getAccount, getAccounts } = useMemo(() => {
    const replacedDbPath = dbPath?.replace('*', '0') ?? null

    return {
      handleSelectAccount: async (sPath: string) => {
        const hid = hidConnector as LedgerHIDConnector
        await hid?.setAccount(sPath)
        close()
      },
      resetAndConnectProvider: async () => {
        const hid = hidConnector as LedgerHIDConnector
        setPaginationIdx(PAGINATION_AMT)
        setAccountsAndBalances([])
        if (replacedDbPath) {
          await hid?.disconnect()
          await hid?.connect({ chainId }, { path: replacedDbPath, reset: true })
        }
      },
      getAccount: async () => {
        if (!replacedDbPath) return null
        const account = await (hidConnector as LedgerHIDConnector).getAccount(replacedDbPath)
        return setPathAddressMap((state) => new Map(state.set(replacedDbPath, account)))
      },
      getAccounts: async () => {
        if (!dbPath) return null
        const hid = hidConnector as LedgerHIDConnector

        try {
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
          console.error(error)
          setAccountsAndBalances([])
        } finally {
          return setLoading(false)
        }
      }
    }
  }, [chainId, close, dbPath, hidConnector, paginationIdx])

  const {
    Component: Selector,
    store: [selection, setSelection]
  } = useSelector({
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
        devError(error)
      }
    }

    if (!dbPath || !chainId) return

    const samePath = SUPPORTED_BIP_DERIVATION_PATHS.find((val) => val === dbPath)
    if (isCustomPath && samePath) setSelection(samePath)

    resetAndGetAccount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbPath, chainId, isCustomPath])

  // We always show list view in tiny screens
  const isSmallerScreen = useIsExtraSmallMediaWidth()

  const { modals: theme } = useTheme()

  return (
    <AccountColumnContainer width="100%" color={'ghostwhite'}>
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
              `${isSmallerScreen ? '' : 'View '}Accounts`
            ) : (
              'Load more'
            )}
          </AccountModalButton>
        </FooterActionButtonsRow>
        <Row marginTop={'1rem'} width="100%" gap="1rem" flexWrap="wrap">
          <Column maxWidth={220}>
            <AccountText fontSize="0.8em" marginBottom="0.25rem" type="balance">
              PRESET PATH
            </AccountText>
            <Selector style={INPUT_STYLES} />
          </Column>
          <Row minWidth={300} width="auto">
            <Column
              css={`
                > input[type='text'] {
                  font-size: 0.85rem;
                }
              `}
              marginLeft="0.5rem"
            >
              <AccountText fontSize="0.8em" marginBottom="0.25rem" type="balance">
                OR CUSTOM PATH
              </AccountText>
              <input
                type="text"
                value={isCustomPath ? path ?? '' : ''}
                placeholder={'m/TYPE/PATH/HERE'}
                onChange={(e) => {
                  setCustom(true)
                  setPath(e.target.value)
                }}
                style={{ ...INPUT_STYLES, minWidth: 300 }}
              />
            </Column>
          </Row>
        </Row>
        <ColumnCenter
          width="100%"
          gap="0.5rem"
          padding="1rem"
          css={`
            z-index: ${errorOptions?.show ? 0 : 1};
            > ${Row} {
              > strong {
                font-weight: 100;
                font-size: 0.85em;

                &:first-child {
                  width: 65%;
                }
                &:nth-child(2) {
                  width: 25%;
                }
                &:last-child {
                  width: 10%;
                }
              }
            }
          `}
        >
          <Row>
            <strong>Address</strong>
            <strong>Path</strong>
            <strong>Balance</strong>
          </Row>
          {accountsAndBalances.map(({ address: acct, balance }, idx) => {
            const sPath = dbPath?.replace('*', idx.toString())
            return (
              <Row
                key={idx + '_' + acct}
                width="100%"
                color="ghostwhite"
                fontWeight={500}
                padding="0.25rem 0"
                css={`
                  cursor: pointer;
                  &:hover {
                    background-color: #848aff4d;
                  }
                  transition: background-color 0.3s ease-in-out;
                `}
                onClick={() => sPath && handleSelectAccount(sPath)}
              >
                <strong>{acct}</strong>
                <strong>{sPath}</strong>
                <strong>{balance || 0}</strong>
              </Row>
            )
          })}
        </ColumnCenter>
      </HidModalContainer>
    </AccountColumnContainer>
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
interface SelectorProps<V extends number | string> {
  defaultValue: V
  options: { value: V; label: string }[]
  name: string
  callback?: (value: V) => void
}
function useSelector<V extends number | string>({
  name,
  options,
  defaultValue,
  callback
}: SelectorProps<V>): {
  Component: (props: { style?: CSSProperties }) => React.JSX.Element
  store: [V, React.Dispatch<React.SetStateAction<V>>]
} {
  const [selection, setSelection] = useState<V>(defaultValue)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelection(e.target.value as V)
      callback?.(e.target.value as V)
    },
    [callback]
  )

  const Component = useCallback(
    ({ style }: { style?: CSSProperties }) => (
      <select name={name} onChange={handleChange} style={style} value={selection}>
        {options.map((opt) => (
          <option key={opt.value + '_' + opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, options, selection]
  )

  const memoisedSetSelection: React.Dispatch<React.SetStateAction<V>> = useCallback(
    (value) => setSelection(value as V),
    []
  )

  return { Component, store: [selection, memoisedSetSelection] }
}

export default memo(HidDeviceOptionsContent)
