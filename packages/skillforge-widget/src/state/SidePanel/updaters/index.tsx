import { SkillId } from '@past3lle/forge-web3'
import React, { useEffect, useMemo, useState } from 'react'

import { useSidePanelAtomBase } from '..'
import { ActiveSkillPanel } from '../../../components/Panels/ActiveSkillPanel'
import { TradeAndUnlockPanel } from '../../../components/Panels/TradeAndUnlockPanel'
import { UserStatsPanel } from '../../../components/Panels/UserStatsPanel'
import { useActiveSkillAtom } from '../../Skills'

export enum ForgeSearchParamKeys {
  FORGE_SKILL_ID = 'forge-skill',
  FORGE_USER_INVENTORY = 'forge-inventory',
  FORGE_UPGRADE_SKILL = 'forge-upgrade-skill'
}
const FORGE_SEARCH_PARAM_KEYS = [
  ForgeSearchParamKeys.FORGE_SKILL_ID,
  ForgeSearchParamKeys.FORGE_USER_INVENTORY,
  ForgeSearchParamKeys.FORGE_UPGRADE_SKILL
]

export function SidePanelUpdater() {
  const [
    {
      type: [panelType]
    }
  ] = useSidePanelAtomBase()
  const [[id], setActiveSkill] = useActiveSkillAtom()
  const [panel, setPanel] = useState<JSX.Element | null>(null)

  const type = panelType?.split('::')?.[0] as 'ACTIVE_SKILL' | 'USER_STATS' | 'UNLOCK_SKILL' | undefined

  const { searchParams, searchParamKey } = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search)
    // Search param keys. We only allow the last one if (for whatever reason) user listed
    // e.g forge.io/?forgeSkillId=0x123123123-1234,forgeUserInventory=true,forgeUpgradeSkill=0x123123123123123-4444
    // we would parse only forgeUpgradeSkill
    const searchParamKey = [...searchParams.keys()]
      .filter((key) => FORGE_SEARCH_PARAM_KEYS.includes(key as ForgeSearchParamKeys))
      .pop()

    return {
      searchParams,
      searchParamKey
    }
  }, [])

  // 1. Change panel based on URL search params
  // 2. Change inner state
  useEffect(() => {
    if (searchParamKey && searchParamKey !== id) {
      switch (searchParamKey) {
        case ForgeSearchParamKeys.FORGE_SKILL_ID: {
          const value = searchParams.get(ForgeSearchParamKeys.FORGE_SKILL_ID)
          if (value) {
            setActiveSkill(value as SkillId)
          }
          setPanel(<ActiveSkillPanel />)
          break
        }
        case ForgeSearchParamKeys.FORGE_USER_INVENTORY: {
          setPanel(<UserStatsPanel />)
          break
        }
        case ForgeSearchParamKeys.FORGE_UPGRADE_SKILL: {
          const value = searchParams.get(ForgeSearchParamKeys.FORGE_UPGRADE_SKILL)
          if (value) {
            setPanel(<TradeAndUnlockPanel />)
          }
          break
        }
      }
    }
    // we don't want id to trigger this useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamKey, searchParams, setActiveSkill])

  // 1. Change panel based on inner state
  // 2. Change URL search params
  useEffect(() => {
    switch (type) {
      case 'ACTIVE_SKILL':
        if (id && searchParamKey !== id) {
          _updateSearchParams(`${ForgeSearchParamKeys.FORGE_SKILL_ID}=${id}`)
        }
        setPanel(<ActiveSkillPanel />)
        break
      case 'USER_STATS':
        _updateSearchParams(ForgeSearchParamKeys.FORGE_USER_INVENTORY)
        setPanel(<UserStatsPanel />)
        break
      case 'UNLOCK_SKILL':
        if (id && searchParamKey !== id) {
          _updateSearchParams(`${ForgeSearchParamKeys.FORGE_UPGRADE_SKILL}=${id}`)
        }
        setPanel(<TradeAndUnlockPanel />)
        break
      default:
        // Reset search param
        _updateSearchParams('')
        setPanel(null)
        break
    }

    // we don't want searchParamKey to trigger this useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type])

  return panel
}

function _updateSearchParams(searchParam: string) {
  if (window.history.pushState) {
    const newURL = new URL(window.location.href)
    newURL.search = searchParam
    window.history.pushState({ path: newURL.href }, '', newURL.href)
  }
}
