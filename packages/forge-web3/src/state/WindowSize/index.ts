import { atom, useAtom } from 'jotai'

interface WindowSizeState {
  ar: number | undefined
  width: number | undefined
  height: number | undefined
}
export const windowSizeAtom = atom<WindowSizeState>({
  ar: undefined,
  width: undefined,
  height: undefined
})
windowSizeAtom.debugLabel = 'WINDOW SIZE ATOM'

export const windowSizeGetter = atom((get) => get(windowSizeAtom))
export const useForgeWindowSizeAtom = () => useAtom(windowSizeGetter)
