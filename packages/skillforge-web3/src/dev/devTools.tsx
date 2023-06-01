import { useAtomsDevtools } from 'jotai-devtools'

interface Props {
  appName: string
}

// Attach atoms to redux devtools
export const AtomsDevtoolsUpdater = ({ appName }: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  process.env.NODE_ENV !== 'production' && useAtomsDevtools(appName)
  return null
}
