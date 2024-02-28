import React from 'react'

import { LinkStyledButton as ButtonLink, StyledLink } from './styleds'

export interface LinkRendererProps {
  href: string
  children: React.ReactNode
  smooth?: boolean
  scroll?: ((element: HTMLElement) => void) | undefined
}

export { StyledLink, ButtonLink }
