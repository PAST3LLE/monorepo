import { AutoRow, Column, ExternalLink, Row, RowCenter, SpinnerCircle, Text } from '@past3lle/components'
import {
  ForgeMetadataState,
  SkillDependencyObject,
  SkillId,
  SkillRarity,
  ipfsToImageUri,
  useForgeBalancesReadAtom,
  useForgeClaimLockedSkill,
  useForgeIpfsGatewayUrisAtom,
  useForgeMetadataMapReadAtom,
  useSupportedChainId
} from '@past3lle/forge-web3'
import { OFF_WHITE, urlToSimpleGenericImageSrcSet } from '@past3lle/theme'
import { darken } from 'polished'
import React, { useMemo, useRef } from 'react'
import { useTheme } from 'styled-components'
import { Address, useWaitForTransaction } from 'wagmi'

import { SKILLPOINTS_CONTAINER_ID } from '../../../constants/skills'
import { useGetActiveSkillFromActiveSkillId } from '../../../hooks/useGetActiveSkillFromActiveSkillId'
import { useSidePanelAtom } from '../../../state/SidePanel'
import { baseTheme } from '../../../theme/base'
import { buildSkillMetadataExplorerUri } from '../../../utils/skills'
import { BlackHeader, MonospaceText } from '../../Common/Text'
import { Skillpoint } from '../../Skillpoint'
import { RequiredDepsContainer, SkillRarityLabel, SkillsRowContainer } from '../ActiveSkillPanel/styleds'
import { SidePanel } from '../BaseSidePanel'
import { ErrorPanel } from '../ErrorPanel'
import { SkillsRowProps } from '../common'
import { TradeAndUnlockActionButton } from './ActionButton'
import { SkillTradeExpandingContainer, TradeAndUnlockPanelContainer } from './styleds'

export function TradeAndUnlockPanel() {
  const chainId = useSupportedChainId()

  const activeSkill = useGetActiveSkillFromActiveSkillId(chainId)

  const [balances] = useForgeBalancesReadAtom()
  const [metadataMap] = useForgeMetadataMapReadAtom(chainId)

  const skillContainerRef = useRef<HTMLElement>(
    typeof document !== undefined ? document.getElementById(SKILLPOINTS_CONTAINER_ID) : null
  )

  const theme = useTheme()

  const rarity = activeSkill.properties.rarity
  const cardColour = 'linear-gradient(195deg,#996ef4,#ffb900)'

  const { metadataExplorerUri, requiresSeveralDepsOfDifferentRarities, depsMap } = useMemo(() => {
    const metadataExplorerUri = buildSkillMetadataExplorerUri('opensea', activeSkill, chainId)
    const depsMap = gatherDepsInfo(activeSkill.properties.dependencies, metadataMap)
    const hasMultiDeps = [...depsMap.entries()].filter(([, list]) => !!list.length).length > 1

    return {
      requiresSeveralDepsOfDifferentRarities: hasMultiDeps,
      metadataExplorerUri,
      depsMap
    }
  }, [activeSkill, chainId, metadataMap])

  const [token, id] = activeSkill.properties.id.split('-')
  const {
    data,
    writeAsync,
    isLoading,
    isError: isErrorContract,
    error
  } = useForgeClaimLockedSkill({
    token: token as Address,
    id: BigInt(id)
  })

  const [, setPanelState] = useSidePanelAtom()

  const { isLoading: isLoadingHash, isSuccess: isSuccessHash } = useWaitForTransaction({
    hash: data?.hash,
    onSettled() {
      // close panel on any settled state
      setPanelState('reset')
    }
  })

  const isClickedButNoHash = isLoading && !data?.hash
  const isPending = isLoadingHash || isLoading || (!!data?.hash && !isSuccessHash)
  const isError = isErrorContract && !!error

  const [gatewayUris] = useForgeIpfsGatewayUrisAtom()
  const bgImageSet = urlToSimpleGenericImageSrcSet(ipfsToImageUri(activeSkill.image, ...gatewayUris.slice(1)))

  return isError ? (
    <ErrorPanel title="UPGRADE ERROR!" reason={error} />
  ) : (
    <SidePanel
      header={activeSkill?.name || 'Unknown'}
      styledProps={{
        background: isPending ? '#fff' : cardColour,
        bgWithDpiOptions: isPending
          ? {
              bgSet: bgImageSet,
              color: '#fff'
            }
          : undefined,
        padding: '2.5rem 0 4rem 0',
        filter: isPending ? 'invert(1) hue-rotate(180deg)' : 'none',
        transition: 'filter 1s ease-out'
      }}
      options={{
        onClickOutsideConditionalCb: (targetNode: Node) => !!skillContainerRef?.current?.contains(targetNode)
      }}
      onDismiss={isPending ? undefined : setPanelState}
      onBack={isPending ? undefined : setPanelState}
    >
      <TradeAndUnlockPanelContainer gap="1rem">
        <Row justifyContent={'center'} margin="0">
          <Text.SubHeader fontSize={'2.5rem'} fontWeight={200}>
            {isClickedButNoHash ? (
              <>
                <p>UPGRADE IN PROGRESS</p>
                PLEASE CONFIRM WITH YOUR CONNECTED WALLET TO CONTINUE!
              </>
            ) : isPending ? (
              <>
                <p>AWAITING SUCCESS CONFIRMATION</p>
                MODAL WILL CLOSE WHEN UPGRADE COMPLETES.
              </>
            ) : (
              `TRADE SKILLS AND UNLOCK ${activeSkill.name.toUpperCase() || 'SKILL'}!`
            )}
          </Text.SubHeader>
        </Row>

        {isPending && (
          <RowCenter
            margin={'2rem auto 4rem'}
            width="100%"
            css={`
              filter: invert(1);
            `}
          >
            <SpinnerCircle size={80} />
          </RowCenter>
        )}

        {isPending && (
          <Row marginBottom={'2rem'}>
            <MonospaceText>
              Checkout this{' '}
              <ExternalLink href="#">
                {' '}
                <strong style={{ color: baseTheme.mainBg }}>tutorial</strong>{' '}
              </ExternalLink>{' '}
              to understand skill upgrade and claiming works.
            </MonospaceText>
          </Row>
        )}

        <SkillTradeExpandingContainer showHover={requiresSeveralDepsOfDifferentRarities}>
          <Column minWidth={'15rem'} width="100%" gap="0.25rem">
            {[...depsMap.entries()].map(([rarity, { length }], idx) => (
              <SkillRarityLabel
                id={`${rarity}_${idx}`}
                backgroundColor={darken(0.02, theme.rarity[rarity as SkillRarity].backgroundColor)}
                color={OFF_WHITE}
                fontWeight={100}
                borderRadius="0.3rem"
                border={`0.2rem solid ${theme.rarity[rarity as SkillRarity].backgroundColor}`}
                justifyContent="flex-start"
                padding="0 0.5rem 0 0.5rem"
                minWidth="10rem"
                textShadow={`1px 1px 1px ${darken(0.3, theme.rarity[rarity as SkillRarity].backgroundColor)}`}
                width="100%"
              >
                <img
                  src={theme.assetsMap.icons.rarity[rarity as SkillRarity]}
                  style={{ maxWidth: '2rem', marginRight: '0.3rem' }}
                />
                <strong style={{ fontSize: '1.65rem' }}>
                  <span style={{ marginRight: '1rem' }}>{rarity?.toLocaleUpperCase()}</span> x{length}
                </strong>
              </SkillRarityLabel>
            ))}
          </Column>
          <img src={'https://cdn-icons-png.flaticon.com/512/3248/3248150.png'} style={{ width: '4.2rem' }} />
          <SkillRarityLabel
            backgroundColor={darken(0.02, theme.rarity[rarity].backgroundColor)}
            color={OFF_WHITE}
            letterSpacing={0}
            fontWeight={100}
            borderRadius="0.3rem"
            marginLeft="0"
            textShadow={`1px 1px 1px ${darken(0.3, theme.rarity[rarity].backgroundColor)}`}
            width="auto"
            justifyContent="flex-start"
          >
            <img src={theme.assetsMap.icons.rarity[rarity]} style={{ maxWidth: '2.5rem', marginRight: '0.3rem' }} />
            <strong style={{ fontSize: '1.65rem', letterSpacing: '-0.3px' }}>{rarity?.toLocaleUpperCase()}</strong>
          </SkillRarityLabel>
        </SkillTradeExpandingContainer>

        {!isPending && (
          <>
            <RequiredDepsContainer overflow={'visible'} background="linear-gradient(90deg, black, transparent 80%)">
              <BlackHeader
                fontSize="1.8rem"
                fontWeight={100}
                margin="0 0 0.25rem 0"
                padding="0"
                letterSpacing={-1}
                width="max-content"
              >
                SKILLS TO TRADE FOR UPGRADE
              </BlackHeader>
              <SkillsCardDeck
                balances={balances}
                deps={activeSkill?.properties.dependencies}
                metadataMap={metadataMap}
                theme={theme}
              />
            </RequiredDepsContainer>

            <BlackHeader
              fontSize="1.8rem"
              fontWeight={100}
              margin="1rem 0 -0.3rem 0"
              padding="0"
              width="max-content"
              letterSpacing={-1}
            >
              SKILL TO UNLOCK + RECEIVE
            </BlackHeader>
            <Row
              id="skill-image-and-store-button"
              justifyContent={'space-around'}
              marginBottom="12%"
              flexWrap={'wrap'}
              gap="1rem 4rem"
            >
              <Skillpoint
                forceRarity="empty"
                metadata={activeSkill}
                hasSkill={false}
                disabledHighlight
                skillpointStyles={{
                  height: '80%',
                  flex: 1.4,
                  padding: '0',
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                  css: `
                > ${RowCenter} {
                  justify-content: flex-start;
                  min-height: 200px;
                  height: 20vh;
                  > img {
                    border-radius: 10px;
                  }
                }
              `
                }}
              />
              {!isPending && <TradeAndUnlockActionButton skill={activeSkill} handleClaim={writeAsync} />}
            </Row>

            {chainId && (
              <AutoRow>
                <MonospaceText>
                  View on{' '}
                  <ExternalLink href={metadataExplorerUri}>
                    {' '}
                    <strong style={{ color: baseTheme.mainBg }}>OpenSea</strong>{' '}
                  </ExternalLink>{' '}
                </MonospaceText>
              </AutoRow>
            )}

            <Row marginTop={'4rem'}>
              <MonospaceText>
                Checkout this{' '}
                <ExternalLink href="#">
                  {' '}
                  <strong style={{ color: baseTheme.mainBg }}>tutorial</strong>{' '}
                </ExternalLink>{' '}
                to understand how to claim your skillpoint NFT.
              </MonospaceText>
            </Row>
          </>
        )}
      </TradeAndUnlockPanelContainer>
    </SidePanel>
  )
}

export function SkillsCardDeck({
  deps,
  metadataMap,
  theme: { assetsMap, ...theme }
}: SkillsRowProps & { theme: ReturnType<typeof useTheme> }) {
  return (
    <SkillsRowContainer padding="0.2rem" gap="0" overflowX={'auto'}>
      {deps.flatMap(({ token, id }, idx) => {
        const skillId: SkillId = `${token}-${id}`
        const skill = metadataMap[skillId]
        const depRarity = skill.properties.rarity
        const depRarityColour = theme.rarity[depRarity].backgroundColor
        return (
          skill && (
            <Column
              key={skill.properties.id}
              css={`
                &:not(:first-child) {
                  margin-left: -7%;
                }
                z-index: ${idx + 1};

                &:hover {
                  margin-right: 10%;
                }

                transition: margin 0.3s ease-in-out;
              `}
            >
              <Skillpoint
                // @ts-ignore
                title={skill.name}
                hasSkill
                metadata={skill}
                skillpointStyles={{
                  css: `
                    width: 14.5vh;
                    height: 14.5vh;
                    box-shadow: unset;
                `
                }}
              />
              <SkillRarityLabel
                backgroundColor={darken(0.02, depRarityColour)}
                color={OFF_WHITE}
                fontWeight={100}
                border={`0.2rem solid ${depRarityColour}`}
                justifyContent="flex-start"
                textShadow={`1px 1px 1px ${darken(0.3, depRarityColour)}`}
              >
                <img src={assetsMap.icons.rarity[depRarity]} style={{ maxWidth: '2rem', marginRight: '0.3rem' }} />
                <strong>{depRarity?.toLocaleUpperCase()}</strong>
              </SkillRarityLabel>
            </Column>
          )
        )
      })}
    </SkillsRowContainer>
  )
}

function gatherDepsInfo(deps: SkillDependencyObject[], metadataMap: ForgeMetadataState['metadataMap'][number]) {
  return deps.reduce((acc, dep) => {
    const skillId = `${dep.token}-${dep.id}` as SkillId
    const rarity = metadataMap[skillId].properties.rarity
    const prevDep = acc.get(rarity)

    acc.set(rarity, [...(prevDep || []), skillId])

    return acc
  }, new Map() as Map<SkillRarity, SkillId[]>)
}
