import { useAtomsDevtools } from 'jotai-devtools'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  appName: string
}

// Attach atoms to redux devtools
export const AtomsDevtools = ({ children, appName }: Props) => {
  useAtomsDevtools(appName)
  return children
}
