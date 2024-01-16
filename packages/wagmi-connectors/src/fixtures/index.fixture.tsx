import React, { useCallback, useEffect, useState } from 'react'
import { Address, parseEther } from 'viem'
import { useAccount, useBalance, useConnect, useDisconnect, useSendTransaction, useSwitchChain } from 'wagmi'

import { LedgerHQProvider } from '../ledgerHid/provider'
import { CosmosWagmiProvider } from './config'

const IS_SERVER = typeof globalThis?.window === 'undefined'

const DEFAULT_HID_PATH = "m/44'/60'/*'/0/0"

const AccountsList = ({ close }: any) => {
  const { address, connector } = useAccount()
  const [hidAccts, setHidAccts] = useState<{ account: Address; path: string }[]>([])
  return (
    <>
      <button onClick={close}>CLOSE</button>
      <br />
      <br />
      <h3>ADDRESS: {address || 'disconnected'}</h3>
      <h3>VIEW HID ACCOUNTS</h3>
      <button
        disabled={!connector}
        onClick={async () => {
          if (!connector) return
          let accts: { account: Address; path: string }[] = []
          for (let i = 0; i < 6; i++) {
            const derivedPath = DEFAULT_HID_PATH.replace('*', i.toString())
            const account = await ((await connector?.getProvider()) as LedgerHQProvider)?.getAddress(derivedPath)
            accts.push({ account: account as Address, path: derivedPath })
            continue
          }
          setHidAccts(accts)
        }}
      >
        List HID accounts
      </button>
      {!!hidAccts.length &&
        hidAccts.map((acct) => (
          <div
            key={acct.account}
            style={{ margin: 5, padding: 10, background: 'darkgrey', cursor: 'pointer' }}
            onClick={async () => {
              if (!connector) return
              await (connector as any).setAccount(acct.path)
            }}
          >
            {acct.account} // {acct.path}
          </div>
        ))}
    </>
  )
}

let timeout: NodeJS.Timeout
const Web3Button = () => {
  const { address, connector, chainId } = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { data: switchChainData, chains, switchChainAsync } = useSwitchChain()

  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    if (!error) return
    clearTimeout(timeout)
    setTimeout(() => setError(undefined), 3000)
    return () => {
      clearTimeout(timeout)
    }
  }, [error])

  if (!IS_SERVER && !!connector && !(window as any)?.__PSTL_CONNECTOR) {
    ;(window as any).__PSTL_CONNECTOR = connector
  }

  return (
    <div>
      <h3>Connected to {address || 'DISCONNECTED!'}</h3>
      <h3>Chain ID: {chainId || 'DISCONNECTED!'}</h3>
      <h3>Connector: {connector ? connector?.id || connector?.type : 'DISCONNECTED!'}</h3>
      {error && (
        <h1 style={{ background: 'indianred', color: 'ghostwhite', fontWeight: 700, padding: 20 }}>{error?.message}</h1>
      )}
      <div style={{ display: 'flex', flexFlow: 'column nowrap', gap: '1rem' }}>
        {connectors.map((conn) => (
          <button
            key={conn.type}
            style={{
              cursor: 'pointer',
              maxWidth: 300,
              padding: 20,
              background: 'pink',
              color: 'black',
              fontWeight: 700
            }}
            onClick={async (e) => {
              e.preventDefault()
              return connectAsync({ connector: conn }).catch(setError)
            }}
          >
            CONNECT TO {conn.id || conn.type}
          </button>
        ))}
      </div>

      <h3>SWITCH CHAIN</h3>
      {chains
        .filter((ch) => ch.id !== chainId)
        .map((chain) => (
          <button
            key={chain.id}
            style={{ cursor: 'pointer', margin: 20, padding: 20, background: 'slategray' }}
            onClick={() => switchChainAsync({ chainId: chain.id }).catch(setError)}
          >
            {chain.name || chain.id}
          </button>
        ))}
      <h3>DISCONNECT</h3>
      <button
        disabled={!connector}
        style={{ cursor: 'pointer', margin: 20, padding: 20, background: 'indianred' }}
        onClick={() =>
          disconnectAsync().catch((e: any) => {
            setError(e)
            throw new Error('wagmi-connectors -- error disconnecting connector:' + e?.message)
          })
        }
      >
        DISCONNECT
      </button>
    </div>
  )
}

function DefaultApp() {
  return <InnerApp />
}

function InnerApp() {
  const [showAccts, setShowAccts] = useState(false)
  return (
    <CosmosWagmiProvider>
      {!showAccts ? (
        <>
          <AppWithWagmiAccess />
          <Web3Button />
          <br />
          <br />
          <button onClick={() => setShowAccts(true)} style={{ padding: 10 }}>
            Show accounts list
          </button>
        </>
      ) : (
        <AccountsList close={() => setShowAccts(false)} />
      )}
    </CosmosWagmiProvider>
  )
}

function AppWithWagmiAccess() {
  const { address } = useAccount()
  const { data, refetch } = useBalance({ address })
  const [sendEthVal, setSendEthVal] = useState('0')
  const [addressToSendTo, setAddress] = useState<Address | undefined>()

  const sendApi = useSendTransaction()

  const [currentTx, setTx] = useState('')
  const handleSendTransaction = useCallback(
    async (args: Parameters<ReturnType<typeof useSendTransaction>['sendTransaction']>[0]) => {
      setTx('pending')
      sendApi
        .sendTransactionAsync(args)
        .then((tx) => {
          setTx(tx)
        })
        .catch((error) => {
          throw error
        })
        .finally(() => {
          setTx('')
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sendApi]
  )

  useEffect(() => {
    // @ts-ignore
    document.body.style = 'background: #050b2e; color: ghostwhite;'
  }, [])

  return (
    <>
      <h1>Here has wagmi access</h1>
      <p>Address: {address}</p>
      <button onClick={() => refetch()}>Get balance</button>
      <p>Balance: {data?.formatted}</p>
      <br />

      <p>Send ETH</p>
      <>
        {!!currentTx && status !== 'success' && (
          <div style={{ width: 300, display: 'flex', gap: '1rem' }}>
            <h4>TX {currentTx} in progress...</h4>
          </div>
        )}
      </>

      <>
        <p>
          Amount
          <input type="text" value={sendEthVal} onChange={(e: any) => setSendEthVal(e.target.value)} />
        </p>
        <p>
          To
          <input type="text" value={addressToSendTo} onChange={(e: any) => setAddress(e.target.value)} />
        </p>
        <button
          onClick={() =>
            addressToSendTo && handleSendTransaction({ value: parseEther(sendEthVal), to: addressToSendTo })
          }
        >
          Send to {addressToSendTo || 'N/A'}
        </button>
      </>
    </>
  )
}

function Updater() {
  useEffect(() => {
    if (typeof globalThis?.window === 'undefined') return
    window.document.body.setAttribute('style', `font-family: system-ui;`)
  }, [])
  return null
}

const withThemeProvider = (Component: () => JSX.Element | null) => (
  <div style={{ fontFamily: 'system-ui' }}>
    <Updater />
    <Component />
  </div>
)

export default {
  web3modal: withThemeProvider(() => <DefaultApp />)
}
