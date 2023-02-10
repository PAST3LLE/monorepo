import { atom, useAtom } from 'jotai'

export type ActiveSidePanel = 'ACTIVE_SKILL' | 'USER_STATS' | undefined
export interface SidePanelState {
  type: ActiveSidePanel
}
const sidePanelAtom = atom<SidePanelState>({
  type: undefined
})
sidePanelAtom.debugLabel = 'SIDE PANEL ATOM'

export const useSidePanelAtom = () => useAtom(sidePanelAtom)
