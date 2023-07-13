import { Column, Row } from '@past3lle/components'
import { upToExtraSmall, upToSmall } from '@past3lle/theme'
import styled from 'styled-components'

import BaseTheme from '../../../theme/baseTheme'
import { ModalButton, ModalTitleText } from '../common/styled'

export const AccountModalButton = styled(ModalButton).attrs((props) => ({
  height: props.height || 'auto',
  justifyContent: props.justifyContent || 'center',
  color: props.color || 'ghostwhite',
  fontSize: props.fontSize || '0.8em',
  padding: props.padding || '0.25rem 0.75rem',
  ...props
}))`
  font-variation-settings: 'wght' 100;
`
export const FooterActionButtonsRow = styled(Row)``
export const AccountText = styled(ModalTitleText).attrs((props) => ({
  fontSize: props.fontSize || '1em',
  fontWeight: props.fontWeight || 150,
  margin: props.margin || 0,
  fontStyle: props.fontStyle || 'normal',
  letterSpacing: props.letterSpacing || '-1.2px',
  ...props
}))``

export const AccountBottomColumnContainer = styled(Column)`
  background-color: ${({ theme }) =>
    theme?.modals?.account?.balanceAndAddressContainer?.backgroundColor ||
    BaseTheme.modes.DEFAULT.modals?.account?.balanceAndAddressContainer?.backgroundColor};
`

export const AccountColumnContainer = styled(Column)`
  .unsupported-small-text {
    font-size: 0.6em;
    color: darkgrey;
    margin-left: 0.35rem;
    font-variation-settings: 'wght' 100;
    letter-spacing: -0.6px;
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

  ${upToSmall`
      > ${Row} {
        flex-flow: row wrap;
        // Details column
        > ${Column} {
          order: 2;
          margin: auto;
        }
        // Logo row
        > ${Row} {
          order: 1;
          margin-bottom: 1rem;
          min-width: 150px;
          > img {
            width: 17vw;
            margin: auto;
          }
        }
        > ${ModalButton} {
            order: 2;
            margin: 1rem auto 0.5rem auto;
        } 
      }
      > ${Column} {
        > ${Row} {
          > ${AccountText} {
            font-size: 1.1em;
          }
        }
        > ${FooterActionButtonsRow} {
          flex-flow: column nowrap;
          gap: 0.5rem 0;
          width: 100%;
          > ${AccountModalButton} {
            height: 50px;
          }
        }
      }
    `}

  ${upToExtraSmall`
    > ${Row} {
      > ${Column} {
        max-width: unset;
      }
    }
    > ${Column} {
      > ${Row} {
        > ${AccountText} {
          font-size: 0.9em;
        }
      }
    }
  `}
`
