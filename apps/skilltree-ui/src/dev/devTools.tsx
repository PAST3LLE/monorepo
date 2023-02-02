import { useAtomsDevtools } from 'jotai-devtools'
import { ReactNode } from 'react'

// Attach atoms to redux devtools
export const AtomsDevtools = ({ children }: { children: ReactNode }) => {
  useAtomsDevtools('SKILLTREE-UI')
  return children
}
