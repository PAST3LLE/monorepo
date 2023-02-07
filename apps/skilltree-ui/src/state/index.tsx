import { useFirebaseStorageAtom } from './Firebase'
import { useSkillsAtom } from './Skills'

export function JotaiStateProvider() {
  useFirebaseStorageAtom()
  useSkillsAtom()

  return null
}
