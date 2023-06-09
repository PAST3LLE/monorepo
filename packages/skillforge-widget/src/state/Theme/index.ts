import { ThemeModesRequired } from '@past3lle/theme'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type AppThemeMode = ThemeModesRequired

const themeModeStorageAtom = atomWithStorage<AppThemeMode>('SKILLFORGE_THEME_MODES', 'DEFAULT')
themeModeStorageAtom.debugLabel = 'THEME ATOM'

const themeModeReadAtom = atom((get) => get(themeModeStorageAtom))
const themeModeWriteAtom = atom<null, AppThemeMode>(null, (_, set, update) => {
  return set(themeModeStorageAtom, update)
})

export const useAppThemeModeRead = () => useAtom(themeModeReadAtom)
export const useAppThemeModeWrite = () => useAtom(themeModeWriteAtom)

export const useAppThemeMode = () => useAtom(themeModeStorageAtom)
