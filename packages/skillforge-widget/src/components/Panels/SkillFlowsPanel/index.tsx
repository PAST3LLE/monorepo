import { Column, ColumnCenter, Row, useCheckboxes } from '@past3lle/components'
import {
  SkillId,
  SkillMetadata,
  useForgeApproveAllBatchCallback,
  useForgeClaimLockedSkillCallback,
  useSupportedChainId
} from '@past3lle/forge-web3'
import { urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import { devError } from '@past3lle/utils'
import React, { useMemo, useState } from 'react'
import { Hash } from 'viem'
import { Address } from 'wagmi'

import { useGetSkillFromIdCallback } from '../../../hooks/skills'
import { ForgeFlowState, useForgeFlowReadAtom } from '../../../state/Flows'
import { useSidePanelWriteAtom } from '../../../state/SidePanel'
import { useActiveSkillAtom } from '../../../state/Skills'
import { useGenericImageSrcSet } from '../../../theme/global'
import { HeaderButton, HeaderButtonProps } from '../../Common/Button/common'
import { SidePanel, SidePanelProps } from '../BaseSidePanel'
import {
  FlowCard,
  FlowRow,
  FlowSkillImageCircle,
  SkillFlowsContainer,
  SubSkillHeader,
  SubSkillHeaderResponse,
  SubSkillRow,
  UpgradingSkillColumn,
  UpgradingSkillHeader,
  UpgradingSkillHeaderResponse,
  UserSkillpointsContainer
} from './styleds'

// import { BgCssDpiProps } from '../BaseSidePanel/styleds'

const BG_SETTINGS: Required<SidePanelProps>['options']['backgroundImageOptions'] = {
  smartImg: {
    uri: 'https://ik.imagekit.io/pastelle/aws-forge/collections/2/0.png?tr=q-100,w-750,h-750,f-auto,pr-true',
    options: { filter: 'hue-rotate(98deg) saturate(3.5) invert(0)' }
  }
  // backgroundCss: {
  //   uri: '',
  //   options: {
  //     bgSet: urlToSimpleGenericImageSrcSet(
  //       'https://ik.imagekit.io/pastelle/aws-forge/collections/2/0.png?tr=q-100,w-750,h-750,f-auto,pr-true'
  //     ),
  //     modeColors: ['#5c6a96cc', '#5c6a96cc'],
  //     blendMode: 'difference'
  //   } as BgCssDpiProps
  // }
}

export function SkillFlowsPanel() {
  const chainId = useSupportedChainId()
  const [flows = {}] = useForgeFlowReadAtom(chainId)

  const [, setPanelState] = useSidePanelWriteAtom()
  const [, setSkill] = useActiveSkillAtom()

  const getSkill = useGetSkillFromIdCallback(chainId)
  const claimLockedSkill = useForgeClaimLockedSkillCallback()
  const approveAllBatchCallback = useForgeApproveAllBatchCallback()

  const { Component: Checkboxes, store } = useCheckboxes({
    name: 'Hide Claimed',
    options: [{ value: 'show', label: 'show' }],
    defaultValue: 'show'
  })

  const hideClaimed = !!store[0]

  const skillFlows = useMemo(() => {
    return Object.entries(flows)
      .filter((f) => (hideClaimed ? f[1].status !== 'claimed' : f))
      .map(([id, flow]) => {
        const upgradingSkill = getSkill(id as SkillId)
        const upgradeStatus = flow.status
        const definedImgUri = upgradingSkill?.image250 || upgradingSkill?.image500 || upgradingSkill?.image
        return (
          <FlowCard key={id} as={Column} gap="2rem" status={flow.status}>
            <Row width="100%" gap="4rem" justifyContent="space-between" alignItems="flex-start">
              <Column alignItems="flex-start" marginTop="1rem" gap="1rem">
                <UpgradingSkillColumn>
                  <UpgradingSkillHeader>NEW SKILL!</UpgradingSkillHeader>
                  <UpgradingSkillHeaderResponse>{upgradingSkill.name}</UpgradingSkillHeaderResponse>
                </UpgradingSkillColumn>
                <UpgradingSkillColumn>
                  <UpgradingSkillHeader>STATUS</UpgradingSkillHeader>
                  <UpgradingSkillHeaderResponse>{_formatFlowStatus(flow.status)}</UpgradingSkillHeaderResponse>
                </UpgradingSkillColumn>
              </Column>
              <FlowSkillImageCircle src={definedImgUri} maxWidth="100px" />
            </Row>
            {upgradeStatus !== 'claimed' && (
              <ColumnCenter
                width="95%"
                gap="1rem"
                css={`
                  border-top: 1px solid #f8f8ff1c;
                `}
              >
                <SubSkillHeader marginTop="1rem" alignSelf="flex-start" color="ghostwhite">
                  ACTION(S) REQUIRED:
                </SubSkillHeader>
                {(flow.transactions || []).map(({ collectionAddress, hash, type }) => {
                  const skillId = `${collectionAddress}-0000` as SkillId
                  const skill = getSkill(skillId)
                  const image = skill?.image250 || skill?.image500 || skill?.image
                  return (
                    <FlowRow
                      key={collectionAddress}
                      backgroundColor="navajowhite"
                      justifyContent="space-between"
                      gap="2rem"
                    >
                      <Column gap="0" flex={1}>
                        <SubSkillRow>
                          <SubSkillHeader>SKILL</SubSkillHeader>
                          <SubSkillHeaderResponse>{skill.name}</SubSkillHeaderResponse>
                        </SubSkillRow>
                        <SubSkillRow>
                          <SubSkillHeader>OPERATION</SubSkillHeader>
                          <SubSkillHeaderResponse>{type.toUpperCase()}</SubSkillHeaderResponse>
                        </SubSkillRow>
                        <SubSkillRow>
                          <SubSkillHeader>STATUS</SubSkillHeader>
                          <SubSkillHeaderResponse>{hash ? 'PENDING' : 'APPROVED'}</SubSkillHeaderResponse>
                        </SubSkillRow>
                      </Column>
                      <FlowSkillImageCircle src={image} maxWidth="70px" />
                    </FlowRow>
                  )
                })}
              </ColumnCenter>
            )}

            <ActionButton
              skill={upgradingSkill}
              flow={flow}
              statusToCallbackMap={{
                claimed: () => setSkill(id as SkillId),
                claimable: async () => claimLockedSkill(upgradingSkill),
                'needs-approvals': async () =>
                  approveAllBatchCallback((flow.transactions || [])?.map((t) => t.collectionAddress))
              }}
            />
          </FlowCard>
        )
      })
  }, [approveAllBatchCallback, claimLockedSkill, flows, getSkill, setSkill, hideClaimed])

  return (
    <SidePanel
      header="UPGRADE STATUS"
      options={{
        backgroundImageOptions: BG_SETTINGS
      }}
      styledProps={{
        background: 'black'
      }}
      onDismiss={() => setPanelState()}
    >
      <SkillFlowsContainer gap="1rem 0">
        <Row gap="2rem">
          <SubSkillHeader color="ghostwhite" letterSpacing="-1.4px">
            HIDE CLAIMED
          </SubSkillHeader>
          <Checkboxes
            checkedColor="#bfef1b"
            checkedScale={0.8}
            borderColor="ghostwhite"
            backgroundColor="transparent"
          />
        </Row>
        <UserSkillpointsContainer borderRadius="5px" minHeight="300px" textAlign={'center'}>
          {skillFlows}
        </UserSkillpointsContainer>
      </SkillFlowsContainer>
    </SidePanel>
  )
}

function _formatFlowStatus(status: ForgeFlowState[number][SkillId]['status']) {
  return status.replace(/-/g, ' ').toUpperCase()
}

function ActionButton({
  skill,
  flow,
  statusToCallbackMap
}: {
  skill: SkillMetadata
  flow: ForgeFlowState[number][SkillId]
  statusToCallbackMap: {
    claimed: () => void
    claimable: () => Promise<Hash>
    ['needs-approvals']: () => Promise<Hash[]>
  }
}) {
  const [clicked, setClicked] = useState(false)
  const srcSet = useGenericImageSrcSet()
  const content = useMemo(() => {
    let fullHeader = 'N/A'
    let iconKey: HeaderButtonProps['iconKey'] = 'inventory'
    let bgImage: ReturnType<typeof useGenericImageSrcSet>['EMPTY_SKILL_DDPX_URL_MAP'] = null
    let bgColor: string | undefined
    switch (flow.status) {
      case 'claimed':
        fullHeader = 'VIEW SKILL!'
        iconKey = 'inventory'
        bgImage = urlToSimpleGenericImageSrcSet(skill?.image250 || skill?.image500 || skill?.image)
        break
      case 'claimable':
        fullHeader = 'UPGRADE SKILL!'
        iconKey = 'transactions'
        bgImage = srcSet.EMPTY_SKILL_DDPX_URL_MAP
        break
      case 'needs-approvals':
        fullHeader = 'APPROVE'
        iconKey = 'transactions'
        bgImage = srcSet.EMPTY_SKILL_DDPX_URL_MAP
        break
    }

    return (
      <HeaderButton
        disabled={clicked}
        height="55px"
        width="60%"
        bgColor={bgColor}
        bgImage={bgImage}
        iconKey={iconKey}
        onClick={async () => {
          try {
            setClicked(true)
            await statusToCallbackMap[flow.status as 'claimable' | 'claimed' | 'needs-approvals']()
            setClicked(false)
          } catch (error: any) {
            devError('[@past3lle/skillforge-widget]::ActionButton --> Error in callback!', error?.message || error)
            setClicked(false)
          }
        }}
        fullHeader={clicked ? 'Pending...' : fullHeader}
      />
    )
  }, [
    clicked,
    flow.status,
    skill?.image,
    skill?.image250,
    skill?.image500,
    srcSet.EMPTY_SKILL_DDPX_URL_MAP,
    statusToCallbackMap
  ])

  return content
}
