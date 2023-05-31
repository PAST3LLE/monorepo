import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { STATE_STORAGE_KEYS } from '../../constants/state-storage-keys'

interface VersionState {
  version: string | undefined
}
export const versionStateAtom = atomWithStorage<VersionState>(STATE_STORAGE_KEYS.SKILLFORGE_VERSION_STATE, {
  version: undefined
})
versionStateAtom.debugLabel = 'SFW3 VERSION ATOM'

export const versionGetter = atom((get) => get(versionStateAtom))
export const useSkillForgeVersionGetterAtom = () => useAtom(versionGetter)
export const useSkillForgeVersionAtom = () => useAtom(versionStateAtom)
