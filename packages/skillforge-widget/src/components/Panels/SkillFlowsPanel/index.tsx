import { Column, ColumnCenter, Row, useCheckboxes } from '@past3lle/components'
import {
  SkillId,
  SkillMetadata,
  useForgeApproveAllBatchCallback,
  useForgeClaimLockedSkillCallback,
  useForgeGetAllUnapprovedTokensForClaimableCallback,
  useSupportedChainId,
  useW3Modals
} from '@past3lle/forge-web3'
import { urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import { devError, truncateHash } from '@past3lle/utils'
import React, { useCallback, useMemo, useState } from 'react'
import { Address, Hash } from 'viem'
import { useAccount } from 'wagmi'

import { useGetSkillFromIdCallback } from '../../../hooks/skills'
import { FlowState, useForgeFlowReadAtom } from '../../../state/Flows'
import { FlowTransactionObject, useForgeFlowTransactionsReadWriteAtom } from '../../../state/Flows/state/transactions'
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

const BG_SETTINGS: Required<SidePanelProps>['options']['backgroundImageOptions'] = {
  smartImg: {
    uri: 'https://ik.imagekit.io/pastelle/aws-forge/collections/2/0.png?tr=q-100,w-750,h-750,f-auto,pr-true',
    options: { filter: 'hue-rotate(98deg) saturate(3.5) invert(0)' }
  }
}

export function SkillFlowsPanel() {
  const { address } = useAccount()
  const chainId = useSupportedChainId()
  const [flows = {}] = useForgeFlowReadAtom(chainId, address)
  const [flowTransactions = {}] = useForgeFlowTransactionsReadWriteAtom(chainId, address)

  const [, setPanelState] = useSidePanelWriteAtom()
  const [, setSkill] = useActiveSkillAtom()

  const getSkill = useGetSkillFromIdCallback(chainId)
  const claimLockedSkill = useForgeClaimLockedSkillCallback()
  const approveAllBatchCallback = useForgeApproveAllBatchCallback()
  const { mutateAsync: getCollectionApprovedCallback } = useForgeGetAllUnapprovedTokensForClaimableCallback()

  const { Component: Checkboxes, store } = useCheckboxes({
    name: 'Hide Claimed',
    options: [{ value: 'show', label: 'show' }],
    defaultValue: undefined
  })

  const hideClaimed = !!store[0]

  const srcSet = useGenericImageSrcSet()
  const { root: w3Modal } = useW3Modals()
  const [hideFlowCardMap, setHideFlowCardMap] = useState<{ [id: string]: boolean }>({})

  const handleHideFlowCard = useCallback(
    (id: string) => (e: Event) => {
      e.preventDefault()
      setHideFlowCardMap((state) => ({
        ...state,
        [id]: !state?.[id]
      }))
    },
    []
  )

  const skillFlows = useMemo(() => {
    return _getListFromMapByKeyValue(flows, 'status', 'claimed', {
      conditionalCheck: !!hideClaimed,
      conditional: 'doesNotEqual'
    }).map(([oId, flow]) => {
      const id = oId as SkillId
      const upgradingSkill = getSkill(id)

      if (!address || !upgradingSkill) return null

      const upgradeStatus = flow.status
      const hidePrerequisites = upgradeStatus !== 'claimed' || upgradeStatus !== 'claimable'
      const definedImgUri = upgradingSkill?.image250 || upgradingSkill?.image500 || upgradingSkill?.image
      return (
        <FlowCard key={id} as={Column} gap="2rem" status={flow.status} onClick={handleHideFlowCard(id)}>
          <span id="flow-card-minimise">CLICK TO {hideFlowCardMap?.[id] ? 'EXPAND' : 'MINIMISE'}</span>
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
          {(!hideFlowCardMap?.[id] || !hidePrerequisites) && (
            <ColumnCenter
              width="95%"
              gap="1rem"
              css={`
                border-top: 1px solid #f8f8ff1c;
              `}
            >
              <SubSkillHeader marginTop="1rem" alignSelf="flex-start" color="ghostwhite" letterSpacing={-1}>
                PREREQUISITE ACTION(S):
              </SubSkillHeader>
              {_getListFromMapByKeyValue(flowTransactions, 'skillId', id).map(([rSkillId, flow], i) => {
                const { hash, status } = flow
                const skillId = rSkillId.replace(/[^-]*$/, '0000') as SkillId
                const skill = getSkill(skillId)

                if (!skill) return null

                const image = skill?.image250 || skill?.image500 || skill?.image
                return (
                  <FlowRow key={i} backgroundColor="navajowhite" justifyContent="space-between" gap="2rem">
                    <Column gap="0" flex={1}>
                      <SubSkillRow>
                        <SubSkillHeader>SKILL</SubSkillHeader>
                        <SubSkillHeaderResponse>{skill.name}</SubSkillHeaderResponse>
                      </SubSkillRow>
                      <SubSkillRow>
                        <SubSkillHeader>OPERATION</SubSkillHeader>
                        <SubSkillHeaderResponse>{_operationTypeToLabel(flow)}</SubSkillHeaderResponse>
                      </SubSkillRow>
                      <SubSkillRow>
                        <SubSkillHeader>HASH</SubSkillHeader>
                        <SubSkillHeaderResponse>
                          {hash ? truncateHash(hash) : 'AWAITING TRANSACTION'}
                        </SubSkillHeaderResponse>
                      </SubSkillRow>
                      <SubSkillRow>
                        <SubSkillHeader>STATUS</SubSkillHeader>
                        <SubSkillHeaderResponse>{(status || 'unsubmitted').toUpperCase()}</SubSkillHeaderResponse>
                      </SubSkillRow>
                    </Column>
                    <FlowSkillImageCircle src={image} maxWidth="70px" />
                  </FlowRow>
                )
              })}
            </ColumnCenter>
          )}

          {!hideFlowCardMap?.[id] && (
            <ActionButton
              skill={upgradingSkill}
              flow={flow}
              assetsSrcSet={srcSet}
              statusToCallbackMap={{
                claimed: () => setSkill(id),
                claimable: async () => claimLockedSkill(upgradingSkill),
                'needs-approvals': async () => {
                  const unapprovedList = await getCollectionApprovedCallback(upgradingSkill)
                  return approveAllBatchCallback(
                    unapprovedList.map((dep) => dep.dependencyId.split('-')[0] as Address),
                    id
                  )
                }
              }}
            />
          )}
        </FlowCard>
      )
    })
  }, [
    flows,
    hideClaimed,
    getSkill,
    address,
    handleHideFlowCard,
    hideFlowCardMap,
    flowTransactions,
    srcSet,
    setSkill,
    claimLockedSkill,
    getCollectionApprovedCallback,
    approveAllBatchCallback
  ])

  return (
    <SidePanel
      header="UPGRADE STATUS"
      options={{
        backgroundImageOptions: BG_SETTINGS
      }}
      styledProps={{
        background: 'black',
        paddingMobile: '4rem 2rem'
      }}
      onDismiss={() => setPanelState()}
    >
      <HeaderButton
        height={50}
        fullHeader="WEB3 TRANSACTIONS"
        iconKey="transactions"
        bgImage={srcSet.EMPTY_SKILL_DDPX_URL_MAP}
        onClick={() => w3Modal.open({ route: 'Transactions' })}
      />
      <SkillFlowsContainer gap="1rem 0">
        {!!address && (
          <HideClaimedCheckbox>
            <Checkboxes
              style={{ width: '1.5rem', height: '1.5rem', marginTop: 1 }}
              checkedColor="#bfef1b"
              checkedScale={0.6}
              borderColor="ghostwhite"
              backgroundColor="transparent"
            />
          </HideClaimedCheckbox>
        )}
        <UserSkillpointsContainer borderRadius="5px" minHeight="300px" textAlign={'center'}>
          {skillFlows}
        </UserSkillpointsContainer>
      </SkillFlowsContainer>
    </SidePanel>
  )
}

function HideClaimedCheckbox({ children }: { children: React.ReactNode }) {
  return (
    <Row gap="0.8rem">
      <SubSkillHeader color="ghostwhite" letterSpacing="-1.4px">
        HIDE CLAIMED
      </SubSkillHeader>
      {children}
    </Row>
  )
}

function _formatFlowStatus(status: FlowState['status']) {
  return status.replace(/-/g, ' ').toUpperCase()
}

function ActionButton({
  skill,
  flow,
  assetsSrcSet: srcSet,
  statusToCallbackMap
}: {
  skill: SkillMetadata
  flow: FlowState
  assetsSrcSet: ReturnType<typeof useGenericImageSrcSet>
  statusToCallbackMap: {
    claimed: () => void
    claimable: () => Promise<Hash>
    ['needs-approvals']: () => Promise<Hash[]>
  }
}) {
  const [clicked, setClicked] = useState(false)
  const content = useMemo(() => {
    let fullHeader = 'Pending...'
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
      case 'approved':
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

function _getListFromMapByKeyValue<M extends Record<SkillId, any>, K extends keyof FlowTransactionObject>(
  transactions: M,
  key: K,
  value: M[SkillId][keyof M[SkillId]],
  opts: {
    conditionalCheck?: boolean
    conditional?: 'equals' | 'doesNotEqual'
  } = {
    conditionalCheck: true,
    conditional: 'equals'
  }
) {
  return Object.entries(transactions).filter(([, val]) =>
    opts.conditionalCheck ? (opts.conditional === 'equals' ? val[key] === value : val[key] !== value) : val
  )
}

/* 
Object.entries(flows)
.filter((entry: [SkillId, FlowState]) => hideClaimed && entry[1].status !== 'claimed')
*/

function _operationTypeToLabel(flow: FlowTransactionObject) {
  const label = flow.type
  return label.toUpperCase()
}
