import { SkillId } from 'components/Skills/types'
import { atom, useAtom } from 'jotai'

export type ActiveSidePanel = `ACTIVE_SKILL::${SkillId}` | 'USER_STATS'
export interface SidePanelState {
  type: (ActiveSidePanel | undefined)[]
}
const sidePanelAtom = atom<SidePanelState>({
  type: []
})

const readWriteSidePanelAtom = atom(
  (get) => {
    const panels = get(sidePanelAtom).type

    return panels
  },
  (get, set, update: ActiveSidePanel | 'reset' | undefined) => {
    const panels = get(sidePanelAtom).type

    const panelsCopy = update === 'reset' ? [] : !update ? panels.slice(1) : [update, ...panels]
    return set(sidePanelAtom, { type: panelsCopy })
  }
)

sidePanelAtom.debugLabel = 'SIDE PANEL ATOM'
export const useSidePanelAtomBase = () => useAtom(sidePanelAtom)
export const useSidePanelAtom = () => useAtom(readWriteSidePanelAtom)
