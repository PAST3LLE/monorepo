import { useAtomsDevtools } from 'jotai-devtools'
import { ReactNode } from 'react'

import { AppConfig } from '../types/appConfig'

interface Props {
  children: ReactNode
  appName: AppConfig['appName']
}

// Attach atoms to redux devtools
export const AtomsDevtools = ({ children, appName }: Props) => {
  useAtomsDevtools(appName)
  return children
}
