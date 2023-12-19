import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { RowCenter, RowProps } from '../Layout/Row'
import { Popover, PopoverProps } from '../Popover'

const TooltipContainer = styled.div`
  width: 228px;
  padding: 0.6rem 1rem;
  line-height: 150%;
  font-weight: 400;
`

interface TooltipProps extends Omit<PopoverProps, 'content'> {
  text: string
}

export function Tooltip({ text, ...rest }: TooltipProps) {
  return <Popover content={<TooltipContainer>{text}</TooltipContainer>} {...rest} />
}

export function MouseoverTooltip({ children, ...rest }: Omit<TooltipProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <Tooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  )
}

const InfoCircleContainer = styled(RowCenter)<{ size?: number }>`
  width: ${({ size = 20 }) => size}px;
  height: ${({ size = 20 }) => size}px;

  > span {
    font-size: ${({ size = 20 }) => Math.floor(size * 0.85)}px;
    font-family: monospace;
    margin: 1px 1px 0 0;
    text-transform: lowercase;
  }
`
export type InfoCircleProps = { label: string; size?: number } & RowProps
export function InfoCircle({ label, size = 20, ...boxProps }: InfoCircleProps) {
  return (
    <InfoCircleContainer
      backgroundColor="ghostwhite"
      color="black"
      borderRadius="50%"
      overflow="hidden"
      width={size}
      height={size}
      size={size}
      {...boxProps}
    >
      <span>{label}</span>
    </InfoCircleContainer>
  )
}
