import React from 'react'

interface Props {
  className?: string
  size?: number
  stroke?: string
  strokeWidth?: number
}

export function CircleOutline({ className, size = 22, stroke = '#D9EAFF', strokeWidth = 0.25 }: Props) {
  const sizePx = `${size}px`
  return (
    <svg className={className} width={sizePx} height={sizePx} viewBox="0 0 22 22">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(1.000000, 0.000000)" stroke={stroke} strokeWidth={strokeWidth}>
          <path d="M20,10.08 L20,11 C19.9974678,15.4286859 17.082294,19.328213 12.8353524,20.583901 C8.58841086,21.839589 4.02139355,20.1523121 1.61095509,16.4370663 C-0.799483376,12.7218205 -0.479136554,7.86363898 2.39827419,4.49707214 C5.27568494,1.13050531 10.0247126,0.0575252842 14.07,1.86"></path>
        </g>
      </g>
    </svg>
  )
}
