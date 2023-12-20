import { CheckCircle, Column, ColumnCenter, Row, RowCenter, RowStart, Search } from '@past3lle/components'
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
import { ModalButton } from '../common/styled'
import {
  MainText,
  SafeConfirmationCardWrapper,
  SafeConfirmationSquare,
  SafeConfirmationSquareGradient,
  SafeConfirmationsGridWrapper,
  SmallText,
  StatusPill,
  StrongText,
  SubheaderText,
  TransactionInput,
  TransactionRow,
  TransactionTitle,
  TransactionWrapper,
  TransactionsModalWrapper,
  statusToCardBgColor,
  statusToConfirmationSpecialColors,
  statusToPillProps
} from './styled'

const SAFE_LOGO_URL = 'https://app.safe.global/images/logo-round.svg'

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
  const { Icon, tooltip, ...statusStyleProps } = statusToPillProps(transaction.status)
  const explorerUri = blockExplorerUris?.default.url
  const formattedHash = transaction.transactionHash ? truncateHash(transaction.transactionHash, { type: 'short' }) : '-'

  return (
    <TransactionWrapper background={statusToCardBgColor(transaction.status)}>
      {/* NONCE */}
      {!!transaction?.nonce && (
        <TransactionRow>
          <TransactionTitle>NONCE</TransactionTitle>
          <MainText>{transaction.nonce || 'n/a'}</MainText>
        </TransactionRow>
      )}
      {/* TX HASH */}
      <TransactionRow>
        <TransactionTitle>TX HASH</TransactionTitle>
        <MainText>
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
        </MainText>
      </TransactionRow>
      {/* SAFE HASH */}
      {!!transaction?.safeTxHash && (
        <TransactionRow>
          <TransactionTitle>SAFE TX HASH</TransactionTitle>
          <MainText>
            {transaction.walletType === 'SAFE'
              ? transaction.safeTxHash
                ? truncateHash(transaction.safeTxHash, { type: 'short' })
                : 'error getting hash!'
              : 'n/a'}
          </MainText>
        </TransactionRow>
      )}
      {/* WALLET TYPE */}
      <TransactionRow>
        <TransactionTitle>WALLET TYPE</TransactionTitle>
        <MainText>{transaction.walletType === 'SAFE' ? 'MULTISIG' : transaction.walletType}</MainText>
      </TransactionRow>
      {/* STATUS */}
      <TransactionRow>
        <TransactionTitle>STATUS</TransactionTitle>
        <StatusPill gap="3" {...statusStyleProps}>
          {Icon && <Icon />}
          <SmallText>{transaction.status}</SmallText>
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
            <SmallText>{transaction.replaceReason}</SmallText>
            <MouseoverCircle text={transaction.replaceReason} label="?" size={14} margin="0" />
          </StatusPill>
        </TransactionRow>
      )}
      {/* CREATION DATE */}
      <TransactionRow>
        <TransactionTitle>CREATION DATE</TransactionTitle>
        <SmallText fontSize="1em">{formatDistanceToNow(transaction.dateAdded)} ago</SmallText>
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
  }: Pick<Required<AnyTransactionReceipt>, 'safeTxInfo'> & { connectorMetadata?: WalletMetaData }) => {
    const { confirmationsRequired, confirmations = [] } = safeTxInfo
    const confirmationsLeft = Math.max(0, confirmationsRequired - confirmations.length)
    return (
      <SafeConfirmationCardWrapper marginTop="2rem" gap="0">
        <RowStart gap="0.2rem">
          <img src={connectorMetadata?.icon || SAFE_LOGO_URL} style={{ maxWidth: 25 }} />
          <SubheaderText marginRight="auto" display="flex" alignItems="center" gap="0.3rem">
            {!!confirmationsLeft ? (
              <>
                SAFE SIGNATURES REQUIRED!
                <StrongText display="inline">
                  {confirmationsLeft} of {confirmationsRequired} REMAINING
                </StrongText>
              </>
            ) : (
              <>
                SAFE SIGNATURES <StrongText display="inline">COMPLETED</StrongText>
                <CheckCircle size={22} style={{ marginBottom: 2 }} />
              </>
            )}
          </SubheaderText>
        </RowStart>
        <SafeConfirmationsGridWrapper view="grid">
          {Array.from({ length: confirmationsRequired }).map((_, i) => {
            const confirmation = { signature: '', owner: '', ...(confirmations as any)?.[i] }
            return (
              <SafeConfirmationSquare key={confirmation.signature} disabled={!confirmation?.signature}>
                <SafeConfirmationSquareGradient
                  gap="0.1rem"
                  flex="1"
                  padding="0.5rem"
                  borderRadius="8px"
                  {...statusToConfirmationSpecialColors(!!confirmation?.signature ? 'success' : 'pending')}
                >
                  <MainText display="flex">
                    CONFIRMATION{' '}
                    <SmallText display="inline-flex" marginLeft="auto">
                      {i + 1}/{confirmationsRequired}
                    </SmallText>
                  </MainText>
                  <Row gap="0.5rem">
                    <img src={SAFE_LOGO_URL} style={{ maxWidth: '19%' }} />
                    <Column flex="1">
                      <TransactionRow fontSize="1em" borderBottom="none" title={confirmation.signature}>
                        <TransactionTitle>SIGNATURE</TransactionTitle>
                        <MainText>{truncateLongString(confirmation.signature as Address)}</MainText>
                      </TransactionRow>

                      <TransactionRow fontSize="1em" borderBottom="none" title={confirmation.owner}>
                        <TransactionTitle>OWNER</TransactionTitle>
                        <MainText>{truncateAddress(confirmation.owner as Address)}</MainText>
                      </TransactionRow>
                    </Column>
                  </Row>
                </SafeConfirmationSquareGradient>
              </SafeConfirmationSquare>
            )
          })}
        </SafeConfirmationsGridWrapper>
      </SafeConfirmationCardWrapper>
    )
  }
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
  <SubheaderText fontSize="2em" textAlign="center">
    :[ no transactions found!
  </SubheaderText>
)

const ConnectButton = ({ callback }: { callback: () => Promise<void> }) => (
  <ModalButton connected={false} modal="transactions" node="main" fontWeight={300} width="auto" onClick={callback}>
    Connect wallet
  </ModalButton>
)

function _formatDateISO(datems: number) {
  return new Date(datems).toISOString()
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
