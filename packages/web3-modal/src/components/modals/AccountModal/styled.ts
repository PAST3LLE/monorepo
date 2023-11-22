import { Column, Row } from '@past3lle/components'
import { fromExtraSmall, upToExtraSmall, upToSmall } from '@past3lle/theme'
import { DeepRequired } from '@past3lle/types'
import styled from 'styled-components'

import { PstlModalThemeExtension, PstlSubModalsTheme, RequiredPstlSubModalsTheme } from '../../../theme'
import { ModalButton, ModalText } from '../common/styled'
import { ModalId } from '../common/types'

export const Icon = styled.img`
  margin-right: 10px;
  max-width: 23px;
  width: 100%;
  filter: ${({ theme }) => (theme?.modals?.account?.icons?.wallet?.invert ? 'invert(1)' : 'none')};
  opacity: 0.8;
`

export const AccountModalButton = styled(ModalButton)`
  justify-content: center;
`
export const FooterActionButtonsRow = styled(Row)`
  flex: 1 1 max-content;
`
export const AccountText = styled(ModalText).attrs((props) => ({
  modal: 'account',
  ...props
}))``

export const AccountStyledContainer = styled(Column)<{
  cursor?: string
  node: keyof DeepRequired<PstlModalThemeExtension>['modals']['account']['container']
}>`
  background-color: ${({ theme, node }) => theme?.modals?.account?.container?.[node]?.background};
`

export const AddressAndBalanceColumnContainer = styled(AccountStyledContainer).attrs((props) => ({
  modal: 'account' as keyof PstlSubModalsTheme,
  node: 'main',
  ...props
}))<{ backgroundColor?: string; cursor: string }>`
  background: ${({ theme, modal, node }) => theme.modals?.[modal]?.container?.[node]?.background};
  > ${Column}:first-child {
    flex: 0 1 68%;
    min-width: max-content;
  }
`

export const AccountLogosRow = styled(Row)<{ backgroundFrameColor?: string }>`
  width: 100%;
  height: 88px;
  > img,
  > svg {
    box-sizing: border-box;
    height: 100%;
    max-width: ${({ theme }) => theme.modals?.account?.connectionImages?.size};
    padding: 1rem;
    background-color: ${({ theme }) => theme.modals?.account?.connectionImages?.background};
  }
  > img:first-child,
  > svg:first-child {
    margin-left: auto;
  }
  > img:last-child,
  > svg:last-child {
    margin-right: auto;
  }
`

export const WalletAndNetworkRowContainer = styled(Row).attrs((props) => ({
  modal: 'account' as keyof PstlSubModalsTheme,
  node: 'main' as keyof RequiredPstlSubModalsTheme['account']['container'],
  ...props
}))<{ backgroundColor?: string; cursor: string }>`
  background: ${({ theme, modal, backgroundColor = theme.modals?.[modal]?.container?.alternate?.background }) =>
    backgroundColor};
  z-index: 1;
  ${Row}#${ModalId.ACCOUNT}__wallets-button {
    cursor: ${({ cursor }) => cursor};
    > ${Column} {
      > ${AccountText} {
        font-weight: 300;
        font-variation-settings: 'wght' 300;
      }
    }
  }
  #${ModalId.ACCOUNT}__network-disconnect-buttons {
    gap: 10px;
    > ${AccountModalButton} {
      min-width: max-content;
    }
  }
  cursor: pointer;
  ${upToExtraSmall`
    > ${Column} > ${Row}#${ModalId.ACCOUNT}__network-disconnect-buttons {
      flex-flow: row wrap;
      ${AccountModalButton} {
        min-width: 180px;
        flex: 1;
      }
    }
  `}
`

export const ModalColumnContainer = styled(Column)<{ layout: 'Account' | 'Other' }>`
  .unsupported-small-text {
    font-size: 0.6em;
    color: darkgrey;
    margin-left: 0.35rem;
    font-variation-settings: 'wght' 100;
    letter-spacing: -0.6px;
  }

  ${AccountModalButton} {
    height: 35px;
  }

  > ${Row} {
    // Details column
    > ${Column} {
      width: 100%;
      order: 0;
    }
    // Logo row
    > ${Row} {
      width: auto;
      flex: 1;
    }
  }

  ${({ layout = 'Account' }) => upToSmall`
    > ${Row} {
      flex-flow: row wrap;
      
      // Details column
      > ${Column} {
        order: ${layout === 'Account' ? 2 : 1};
        margin: auto;
        max-width: unset;
      }

      // Logo row
      > ${Row} {
        order: ${layout === 'Account' ? 1 : 2};
        margin-bottom: 1rem;
        min-width: 150px;
        width: 100%;
        > img {
          width: 17vw;
          margin-left: auto;
        }
      }

      > ${ModalButton} {
          order: ${layout === 'Account' ? 2 : 1};
          margin: 1rem auto 0.5rem auto;
      } 
    }

    > ${Column} {
      > ${FooterActionButtonsRow} {
        flex-flow: column nowrap;
        gap: 0.5rem 0;
        width: 100%;
      }
    }
  `}
  ${({ theme }) => upToExtraSmall`
    // Address text
    ${AccountText}#pstl-web3-modal-address-text, ${AccountText}#pstl-web3-modal-wallet-text, ${AccountText}#pstl-web3-modal-network-text {
      font-size: calc(${theme.modals?.account?.text?.header?.size} * 0.8);
    }
  `}
  ${({ layout = 'Account' }) => fromExtraSmall`
    ${AccountStyledContainer} {
      flex-flow: row wrap;

      > #${ModalId.ACCOUNT}__balance-text {
        order: ${layout === 'Account' ? 2 : 1};
      }

      > ${FooterActionButtonsRow} {
        margin: 0 0 0 auto;
        order: ${layout === 'Account' ? 1 : 0};

        > ${AccountModalButton}#${ModalId.ACCOUNT}__copy-button {
          display: none;
        }
      }
    }

    > ${Row} {
      // network/wallet wrapper
      > ${Column}:first-child {
        flex-flow: row nowrap;
        max-width: unset;

        div#pstl-w3modal-account__wallets-button {
          background: transparent;
          padding: 0;
          height: 100%;
          > ${Column} {
            height: 100%;
            justify-content: space-evenly;
          }
        }
        // Switch/Disconnect buttons
        > ${Row}:last-child {
          flex-flow: column nowrap;
          height: 100%;
          max-width: 32%;
          margin-top: 0;
        }
      }
    }
  `}
`

export const AccountColumnContainer = styled(ModalColumnContainer).attrs({ layout: 'Account' })``
