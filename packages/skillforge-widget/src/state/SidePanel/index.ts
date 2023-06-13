import { SkillId } from '@past3lle/forge-web3'
import { atom, useAtom } from 'jotai'

// @ts-ignore
export type ActiveSidePanel = `ACTIVE_SKILL::${SkillId}` | 'USER_STATS' | `UNLOCK_SKILL::${SkillId}`
export interface SidePanelState {
  type: (ActiveSidePanel | undefined)[]
}
const sidePanelAtom = atom<SidePanelState>({
  type: []
})

const writeSidePanelAtom = atom(null, (get, set, update: ActiveSidePanel | 'reset' | undefined) => {
  const panels = get(sidePanelAtom).type

  const panelsCopy = update === 'reset' ? [] : !update ? panels.slice(1) : [update, ...panels]
  return set(sidePanelAtom, { type: panelsCopy })
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
export const useSidePanelWriteAtom = () => useAtom(writeSidePanelAtom)
export const useSidePanelAtomBase = () => useAtom(sidePanelAtom)
export const useSidePanelAtom = () => useAtom(readWriteSidePanelAtom)
