import { devDebug } from '@past3lle/utils'
import { useEffect } from 'react'

import { useSkillForgeVersionAtom } from '..'
import { STATE_STORAGE_KEYS } from '../../../constants/state-storage-keys'
import pkgVersion from '../../../version.json'

export function SkillForgeVersionAndCacheBustUpdater() {
  const [{ version }, setVersion] = useSkillForgeVersionAtom()

  useEffect(() => {
    const cachedVersion = JSON.parse(localStorage.getItem(STATE_STORAGE_KEYS.SKILLFORGE_VERSION_STATE) || '{}')?.version
    if (pkgVersion?.version !== cachedVersion) {
      devDebug('[SkillForgeVersionAndCacheBustUpdater] version mismatch, clearing local storage and updating version')
      // remove all other state from localStorage
      Object.keys(STATE_STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
      setVersion({ version: pkgVersion?.version })
    }
  }, [pkgVersion?.version, version])

  return null
}
