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

export const windowSizeGetter = atom((get) => get(windowSizeAtom))
export const useGetWindowSize = () => useAtom(windowSizeGetter)
