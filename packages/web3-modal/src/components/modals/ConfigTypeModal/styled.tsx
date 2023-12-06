import { Column, Row, RowCenter } from '@past3lle/components'
import { upToExtraSmall } from '@past3lle/theme'
import styled from 'styled-components'

import { AccountColumnContainer } from '../AccountModal/styled'
import { ConnectorOption } from '../ConnectionModal/ConnectorOption'
import { ModalText } from '../common/styled'

export const ExplainerWrapper = styled(RowCenter)`
  position: absolute;

  > ${ModalText} {
    display: flex;
    align-items: center;
    justify-content: center;

    font-variation-settings: 'wght' 100;
    font-weight: 100;
    font-size: 22px;
    line-height: 1.2;

    ${upToExtraSmall`
      font-size: 17px;
    `}

    strong {
      font-variation-settings: 'wght' 500;
    }
  }
`
export const StyledConnectorOption = styled(ConnectorOption)``

export const DiagonalChoiceWrapper = styled(Row)`
  width: 100%;

  > ${StyledConnectorOption}, > ${ExplainerWrapper} {
    transition: opacity 500ms ease-in-out;
  }

  > ${StyledConnectorOption} {
    opacity: 1;
  }
  > ${ExplainerWrapper} {
    opacity: 0;
  }

  &:hover {
    > ${StyledConnectorOption} {
      opacity: 0;
    }
    > ${ExplainerWrapper} {
      opacity: 1;
    }
  }
`

const ROTATE_AMT = 39
export const DiagonalWrapper = styled(Column)`
  overflow: hidden;
  gap: 0.2rem;
  height: 100%;
  width: 100%;
  transform: rotate(-${ROTATE_AMT}deg) scale(2.4);

  > ${Row} {
    cursor: pointer;
    height: 50%;
    overflow: hidden;
    z-index: 1;

    transition: filter 0.3s ease-in-out, opacity 0.3s ease-in-out;

    &:hover {
      filter: invert(1);
      opacity: 0.2;
    }

    &:first-child {
      background: #8960c1;
      align-items: end;

      > ${ExplainerWrapper} > ${ModalText} {
        margin-right: 1rem;
        margin-top: -2rem;
        text-align: left;
      }

      > ${StyledConnectorOption} {
        > div {
          padding-bottom: 0;
          flex-flow: column-reverse;
          margin-left: -1rem;
          > img {
            filter: invert(1) drop-shadow(2px 4px 3px rgba(0 0 0 / 0.7));
          }
        }
      }
    }
    &:last-child {
      align-items: start;
      background: #403c46;

      > ${ExplainerWrapper} > ${ModalText} {
        margin-right: -1rem;
        margin-top: 2rem;
        text-align: right;
      }

      > ${StyledConnectorOption} {
        > div {
          padding-top: 0;
          flex-flow: column;
          margin-left: 1rem;
        }
      }
    }

    > ${StyledConnectorOption}, > ${ExplainerWrapper} {
      z-index: 0;
      height: 50%;
      width: 100%;
      transform: rotate(${ROTATE_AMT}deg);

      > div {
        background: none;
        height: 100%;
        justify-content: center;
        gap: 0.25rem;

        font-variation-settings: 'wght' 100;
        font-weight: 100;

        > img {
          max-height: 70%;
          filter: drop-shadow(2px 4px 3px rgba(0 0 0 / 0.7));
        }
      }
    }
  }

  ${upToExtraSmall`
  > ${Row} {
    &:first-child {
      > ${StyledConnectorOption} {
        > div {
          margin-left: 0;
          > img {
            max-height: 10vw;
          }
        }
      }
    }
    
    &:last-child {
        > ${StyledConnectorOption} {
          > div {
            margin-left: 0;
            > img {
              max-height: 8vw;
            }
          }
        }
      }
    }
    
  `}
`
export const ConfigModalContainer = styled(AccountColumnContainer)`
  border-radius: ${(props) => props.theme.modals?.base?.container?.main?.border?.radius};
  height: 400px;
  overflow: hidden;
  position: relative;

  > ${ExplainerWrapper} {
    width: 50%;
    &:first-child {
      top: 1rem;
      left: 1rem;
    }
    &:nth-child(2) {
      bottom: 1rem;
      right: 1rem;
      > ${ModalText} {
        text-align: right;
      }
    }
  }
`
