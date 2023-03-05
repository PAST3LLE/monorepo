import { Z_INDICES } from '@past3lle/constants'
import { transparentize } from 'polished'
import styled from 'styled-components'

export const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: ${Z_INDICES.MODALS};

  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;

  background: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg3};
  box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.9, theme.shadow1)};
  color: ${({ theme }) => theme.text2};
  border-radius: ${({ theme }) => theme.button.border.radius};
`

export const ReferenceElement = styled.div`
  display: inline-block;
`

export const Arrow = styled.div`
  width: 8px;
  height: 8px;
  z-index: ${Z_INDICES.MODALS - 1};

  ::before {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: ${Z_INDICES.MODALS - 1};

    content: '';
    border: 1px solid ${({ theme }) => theme.bg3};
    transform: rotate(45deg);
    background: ${({ theme }) => theme.bg2};
  }

  &.arrow-top {
    bottom: -5px;
    ::before {
      border-top: none;
      border-left: none;
    }
  }

  &.arrow-bottom {
    top: -5px;
    ::before {
      border-bottom: none;
      border-right: none;
    }
  }

  &.arrow-left {
    right: -5px;

    ::before {
      border-bottom: none;
      border-left: none;
    }
  }

  &.arrow-right {
    left: -5px;
    ::before {
      border-right: none;
      border-top: none;
    }
  }
`
