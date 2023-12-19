import {
  Column,
  ColumnCenter,
  Row,
  RowCenter,
  RowStart,
  Search,
  Slash,
  SpinnerCircle,
  ThumbsUp
} from '@past3lle/components'
import { useDebouncedChangeHandler } from '@past3lle/hooks'
import { Address } from '@past3lle/types'
import { truncateAddress, truncateHash, truncateLongString } from '@past3lle/utils'
import { formatDistanceToNow } from 'date-fns'
import React, { memo, useMemo, useState } from 'react'
import { Hash } from 'viem'

import { AnyTransactionReceipt } from '../../../controllers/TransactionsCtrl/types'
import {
  WalletMetaData,
  useAccountNetworkActions,
  usePstlWeb3ModalStore,
  useUserConnectionInfo,
  useWalletMetadata
} from '../../../hooks'
import { useTransactions } from '../../../hooks/api/useTransactions'
import { PstlWeb3ModalProps } from '../../../providers'
import { MouseoverCircle } from '../../tooltips/MouseoverCircle'
import { ModalButton, ModalText } from '../common/styled'
import {
  PillProps,
  SafeConfirmationCardWrapper,
  SafeConfirmationSquare,
  SafeConfirmationsGridWrapper,
  StatusPill,
  TransactionInput,
  TransactionRow,
  TransactionTitle,
  TransactionWrapper,
  TransactionsModalWrapper
} from './styled'

function TransactionModalContent() {
  const { transactions } = useTransactions()
  const { onAccountClick } = useAccountNetworkActions()
  const { address, chain } = useUserConnectionInfo()
  const {
    state: {
      userOptions: { chains }
    }
  } = usePstlWeb3ModalStore()
  const connectorMetadata = useWalletMetadata()

  const [search, setSearch] = useState<string>('')
  const [dbSearch, handleSearch] = useDebouncedChangeHandler(search, setSearch, 450)

  const content = useMemo(() => {
    const filteredTxs = transactions
      .filter(_handleTxFilter(dbSearch))
      // Sort descending nonce.
      // 0 nonce shows top (new tx)
      .sort(_sortBy('dateAdded', 'descending'))
      .map((transaction, idx) => (
        <TransactionCard
          key={`${transaction?.transactionHash || transaction?.safeTxHash || idx}_${transaction.nonce}`}
          connectorMetadata={connectorMetadata}
          blockExplorerUris={{
            default: { name: 'void', url: '#' },
            ...chain?.blockExplorers,
            ...chains?.blockExplorerUris
          }}
          transaction={transaction}
        />
      ))

    return transactions.length ? (
      filteredTxs.length ? (
        filteredTxs
      ) : (
        <NoTxFoundMessage />
      )
    ) : (
      <ColumnCenter height="100%" alignItems="center" justifyContent="center" gap="1rem">
        <NoTxFoundMessage />
        {!address && <ConnectButton callback={onAccountClick} />}
      </ColumnCenter>
    )
  }, [
    address,
    chain?.blockExplorers,
    chains?.blockExplorerUris,
    connectorMetadata,
    dbSearch,
    onAccountClick,
    transactions
  ])

  return (
    <>
      <TransactionSearchBar
        address={address}
        placeholder={
          address ? 'Search by hash / nonce / ISO date / status' : 'Connect wallet to view and search transactions'
        }
        onChange={(e) => handleSearch(e.target.value)}
        value={dbSearch}
      />
      <TransactionsModalWrapper width="100%" height="100%">
        {content}
      </TransactionsModalWrapper>
    </>
  )
}

export const TransactionCard = memo(function TransactionComponent({
  transaction,
  blockExplorerUris,
  connectorMetadata
}: {
  transaction: AnyTransactionReceipt
  blockExplorerUris?: PstlWeb3ModalProps['blockExplorerUris']
  connectorMetadata?: WalletMetaData
}) {
  const { Icon, tooltip, ...statusStyleProps } = _statusToPillProps(transaction.status)
  const explorerUri = blockExplorerUris?.default.url
  const formattedHash = transaction.transactionHash ? truncateHash(transaction.transactionHash, { type: 'short' }) : '-'

  return (
    <TransactionWrapper background={_statusToCardBgColor(transaction.status)}>
      {/* NONCE */}
      {!!transaction?.nonce && (
        <TransactionRow>
          <TransactionTitle>NONCE</TransactionTitle>
          <ModalText modal="transactions" node="main">
            {transaction.nonce || 'n/a'}
          </ModalText>
        </TransactionRow>
      )}
      {/* TX HASH */}
      <TransactionRow>
        <TransactionTitle>TX HASH</TransactionTitle>
        <ModalText modal="transactions" node="main">
          {transaction.transactionHash ? (
            explorerUri ? (
              <a href={`${explorerUri}/tx/${transaction.transactionHash}`} target="_blank" referrerPolicy="no-referrer">
                {formattedHash}
              </a>
            ) : (
              formattedHash
            )
          ) : transaction.status !== 'reverted' ? (
            <RowCenter gap="0.25rem">incoming...</RowCenter>
          ) : (
            '-'
          )}
        </ModalText>
      </TransactionRow>
      {/* SAFE HASH */}
      {!!transaction?.safeTxHash && (
        <TransactionRow>
          <TransactionTitle>SAFE TX HASH</TransactionTitle>
          <ModalText modal="transactions" node="main">
            {transaction.walletType === 'SAFE'
              ? transaction.safeTxHash
                ? truncateHash(transaction.safeTxHash, { type: 'short' })
                : 'error getting hash!'
              : 'n/a'}
          </ModalText>
        </TransactionRow>
      )}
      {/* WALLET TYPE */}
      <TransactionRow>
        <TransactionTitle>WALLET TYPE</TransactionTitle>
        <ModalText modal="transactions" node="main">
          {transaction.walletType === 'SAFE' ? 'MULTISIG' : transaction.walletType}
        </ModalText>
      </TransactionRow>
      {/* STATUS */}
      <TransactionRow>
        <TransactionTitle>STATUS</TransactionTitle>
        <StatusPill gap="3" {...statusStyleProps}>
          {Icon && <Icon />}
          <ModalText modal="transactions" node="small">
            {transaction.status}
          </ModalText>
          {tooltip && (
            <MouseoverCircle
              text={tooltip.text}
              label="?"
              size={14}
              backgroundColor={tooltip.backgroundColor}
              margin="0"
            />
          )}
        </StatusPill>
      </TransactionRow>
      {/* REPLACE REASON */}
      {transaction?.replaceReason && (
        <TransactionRow>
          <TransactionTitle>REASON</TransactionTitle>
          <StatusPill gap="3" {...statusStyleProps}>
            <ModalText modal="transactions" node="small">
              {transaction.replaceReason}
            </ModalText>
            <MouseoverCircle text={transaction.replaceReason} label="?" size={14} margin="0" />
          </StatusPill>
        </TransactionRow>
      )}
      {/* CREATION DATE */}
      <TransactionRow>
        <TransactionTitle>CREATION DATE</TransactionTitle>
        <ModalText modal="transactions" node="small" fontSize="1em">
          {formatDistanceToNow(transaction.dateAdded)} ago
        </ModalText>
      </TransactionRow>
      {/* CONFIRMATIONS */}
      {!!transaction.safeTxInfo && (
        <SafeConfirmationsCard safeTxInfo={transaction.safeTxInfo} connectorMetadata={connectorMetadata} />
      )}
    </TransactionWrapper>
  )
})

const SafeConfirmationsCard = memo(
  ({
    safeTxInfo,
    connectorMetadata
  }: Pick<Required<AnyTransactionReceipt>, 'safeTxInfo'> & { connectorMetadata?: WalletMetaData }) => (
    <SafeConfirmationCardWrapper marginTop="2rem" gap="0">
      <RowStart gap="0.2rem">
        <img
          src={connectorMetadata?.icon || 'https://avatars.githubusercontent.com/u/102983781?s=200&v=4'}
          style={{ maxWidth: 25 }}
        />
        <ModalText modal="transactions" node="subHeader" marginRight="auto">
          SAFE SIGNATURES REQUIRED: {safeTxInfo.confirmationsRequired}
        </ModalText>
      </RowStart>
      <SafeConfirmationsGridWrapper view="grid">
        {Array.from({ length: safeTxInfo.confirmationsRequired }).map((_, i) => {
          const confirmation = { signature: '', owner: '', ...safeTxInfo.confirmations?.[i] }
          return (
            <SafeConfirmationSquare key={confirmation.signature} disabled={!confirmation?.signature}>
              <Column
                gap="0.1rem"
                flex="1"
                padding="0.5rem"
                borderRadius="8px"
                backgroundColor={_statusToPillProps('pending').backgroundColor}
              >
                <ModalText modal="transactions" node="main" display="flex">
                  CONFIRMATION{' '}
                  <ModalText modal="transactions" node="small" display="inline-flex" marginLeft="auto">
                    {i + 1}/{safeTxInfo.confirmationsRequired}
                  </ModalText>
                </ModalText>
                <Row gap="0.5rem">
                  <img src="https://avatars.githubusercontent.com/u/102983781?s=200&v=4" style={{ maxWidth: '21%' }} />
                  <Column flex="1">
                    <TransactionRow fontSize="1em" borderBottom="none">
                      <TransactionTitle>SIGNATURE</TransactionTitle>
                      <ModalText modal="transactions" node="main">
                        {truncateLongString(confirmation.signature as Address)}
                      </ModalText>
                    </TransactionRow>

                    <TransactionRow fontSize="1em" borderBottom="none">
                      <TransactionTitle>OWNER</TransactionTitle>
                      <ModalText modal="transactions" node="main">
                        {truncateAddress(confirmation.owner as Address)}
                      </ModalText>
                    </TransactionRow>
                  </Column>
                </Row>
              </Column>
            </SafeConfirmationSquare>
          )
        })}
      </SafeConfirmationsGridWrapper>
    </SafeConfirmationCardWrapper>
  )
)

const TransactionSearchBar = ({
  address,
  ...inputProps
}: React.InputHTMLAttributes<HTMLInputElement> & { address: Address | undefined }) => (
  <RowCenter gap="1rem" padding="0 1rem">
    <Search size={30} stroke="ghostwhite" />
    <TransactionInput {...inputProps} disabled={!address} />
  </RowCenter>
)

const NoTxFoundMessage = () => (
  <ModalText modal="base" node="subHeader" fontSize="2em" textAlign="center">
    :[ no transactions found!
  </ModalText>
)

const ConnectButton = ({ callback }: { callback: () => Promise<void> }) => (
  <ModalButton connected={false} modal="transactions" node="main" fontWeight={300} width="auto" onClick={callback}>
    Connect wallet
  </ModalButton>
)

function _formatDateISO(datems: number) {
  return new Date(datems).toISOString()
}

function _statusToCardBgColor(status: AnyTransactionReceipt['status']) {
  switch (status) {
    case 'success':
      return 'linear-gradient(45deg,#000000ba 60%,#062e1dd4)'
    case 'reverted':
      return 'linear-gradient(45deg,#000000ba 40%,#2c0e0ebd)'
    default:
      return '#00000091'
  }
}

function _statusToPillProps(status: AnyTransactionReceipt['status']): PillProps {
  switch (status) {
    case 'success':
    case 'replaced-success':
      return {
        backgroundColor: '#708c7e',
        color: 'ghostwhite',
        Icon: ThumbsUp
      }
    case 'reverted':
      return {
        backgroundColor: '#994e4e',
        color: 'ghostwhite',
        tooltip: {
          text: 'Transaction was not confirmed. This may mean the transaction reverted, cancelled, or overwritten by another transaction e.g speed-up',
          backgroundColor: '#c03838'
        },
        Icon: Slash
      }
    case 'pending':
    case 'replaced-pending':
      return {
        backgroundColor: '#657bb9a8',
        color: 'ghostwhite',
        Icon: (() => <SpinnerCircle stroke="white" />) as any
      }
  }
}

const _handleTxFilter = (search: string) => (tx: AnyTransactionReceipt) => {
  const dateSearch = search.includes('date:')
  const txHashSearch = search.includes('hash:')
  const nonceSearch = search.includes('nonce:')
  const statusSearch = search.includes('status:')
  const safeHashSearch = search.includes('safe:')

  if (nonceSearch) {
    return tx?.nonce?.toString().includes(search.split('nonce:')[1])
  } else if (txHashSearch) {
    return tx?.transactionHash?.includes(search.split('hash:')[1])
  } else if (safeHashSearch) {
    return tx?.safeTxHash?.toString().includes(search.split('safe:')[1])
  } else if (dateSearch) {
    const dateFormatted = _formatDateISO(tx?.dateAdded)
    return dateFormatted?.includes(search.split('date:')[1])
  } else if (statusSearch) {
    return tx.status?.includes(search.split('status:')[1])
  }

  return Boolean(
    (tx?.transactionHash as Hash)?.includes(search) ||
      (tx?.safeTxHash as Hash | undefined)?.includes(search) ||
      tx?.nonce?.toString().includes(search) ||
      tx?.dateAdded?.toString().includes(search) ||
      tx?.status?.includes(search)
  )
}

const _sortBy =
  (sortByKey: keyof AnyTransactionReceipt, order: 'ascending' | 'descending') =>
  (a: AnyTransactionReceipt, b: AnyTransactionReceipt) =>
    typeof a[sortByKey] === 'number'
      ? order === 'descending'
        ? (b[sortByKey] as number) - (a[sortByKey] as number)
        : (a[sortByKey] as number) - (b[sortByKey] as number)
      : 0

export default memo(TransactionModalContent)
