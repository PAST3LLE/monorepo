import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'

import { STATE_STORAGE_KEYS } from '../../constants/state-storage-keys'
import pkgVersion from '../../version.json'

interface VersionState {
  version: string | undefined
}
export const versionStateAtom = atomWithStorage<VersionState>(STATE_STORAGE_KEYS.FORGE_VERSION_STATE, {
  version: undefined
})
versionStateAtom.debugLabel = 'SFW3 VERSION ATOM'

export const versionGetter = atom((get) => get(versionStateAtom))
export const useForgeVersionGetterAtom = () => useAtom(versionGetter)
export const useForgeVersionAtom = () => useAtom(versionStateAtom)

// react hook that checks the local storage version against the current version and returns true if they match
export const useForgeVersionUpToDate = () => {
  const [{ version }] = useForgeVersionAtom()

  return useMemo(() => version === pkgVersion?.version, [version])
}
