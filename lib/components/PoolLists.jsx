import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { POOL_LIST_TABS } from 'lib/constants'
import { ANIM_LIST_VARIANTS } from 'lib/constants/framerAnimations'
import { PoolRow } from 'lib/components/PoolRow'
import { Tabs, Tab, ContentPane } from 'lib/components/Tabs'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { PoolsListUILoader } from 'lib/components/loaders/PoolsListUILoader'
import { useCommunityPools, useGovernancePools } from 'lib/hooks/usePools'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { useEnvChainIds } from 'lib/hooks/chainId/useEnvChainIds'
import { ALL_NETWORKS_ID, getNetworkNiceNameByChainId } from 'lib/utils/networks'
import { NetworkIcon } from 'lib/components/NetworkIcon'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import { networkNameToChainId } from 'lib/utils/networkNameToChainId'
import { useOnEnvChange } from 'lib/hooks/useOnEnvChange'

/**
 * Displays a list of Pools.
 * Filters based on query parameter `filter=[networkName]` OR a the path `/pools/[networkName]`
 * If the app is in the wrong mode for the filter
 * (ex. filter mainnet pools by rinkeby) or the filter is invalid, it is ignored.
 * @returns
 */
export const PoolLists = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const poolFilters = usePoolFilters()
  const envChainIds = useEnvChainIds()
  const [chainIdFilter, setChainIdFilter] = useState(ALL_NETWORKS_ID)
  const [selectedTab, setSelectedTab] = useState()

  // TODO: Clean & generalize. This is ugly.
  // Need to have a fallback for the render switching from
  // mainnet -> testnet and poolFilters have updated
  // but useOnEnvChange hasn't triggered yet
  const formatValue = (key) => poolFilters[key]?.view || null
  useOnEnvChange(() => {
    setChainFilter(ALL_NETWORKS_ID)
  })

  const queryTab = router?.query?.tab
  const pathFilter = router?.query?.networkName
  const queryFilter = router?.query?.filter

  // TODO: This is kind of messy. Fighting with animations triggering between
  // /pools/polygon vs /pools vs pools?filter=polygon.
  // Current solution ALWAYS adds ?tab=pools
  // and will not change the route, just adds filters to query params.
  useEffect(() => {
    if (queryTab) {
      setSelectedTab(queryTab)
    } else if (!selectedTab && router.isReady) {
      queryParamUpdater.add(router, { tab: POOL_LIST_TABS.pools })
    }
  }, [queryTab, router.isReady])

  const setChainFilter = (chainIdFilter) => {
    if (chainIdFilter !== ALL_NETWORKS_ID) {
      queryParamUpdater.add(router, { filter: chainIdToNetworkName(Number(chainIdFilter)) })
    } else {
      queryParamUpdater.remove(router, 'filter')
    }
  }

  useEffect(() => {
    // Only for undefined. !queryFilter catches the ALL state and then path filter overrides it.
    if (queryFilter === undefined) {
      const filterChainId = networkNameToChainId(pathFilter)
      // Only set path filter IF we are in the right environment
      if (pathFilter && filterChainId && envChainIds.includes(filterChainId)) {
        setChainIdFilter(Number(filterChainId) || ALL_NETWORKS_ID)
      } else {
        setChainIdFilter(ALL_NETWORKS_ID)
      }
    } else {
      // Check if filter matches app env
      const filterChainId = networkNameToChainId(queryFilter)
      if (filterChainId && envChainIds.includes(filterChainId)) {
        setChainIdFilter(Number(filterChainId))
      } else {
        setChainIdFilter(ALL_NETWORKS_ID)
      }
    }
  }, [queryFilter, pathFilter, envChainIds])

  return (
    <div className='mt-10'>
      <div className='flex flex-col xs:flex-row justify-between items-center text-xs sm:text-lg lg:text-xl'>
        <Tabs className=''>
          <Tab
            isSelected={selectedTab === POOL_LIST_TABS.pools}
            onClick={() => {
              queryParamUpdater.add(router, { tab: POOL_LIST_TABS.pools })
            }}
          >
            {t('pools')}
          </Tab>
          <Tab
            isSelected={selectedTab === POOL_LIST_TABS.community}
            onClick={() => {
              queryParamUpdater.add(router, { tab: POOL_LIST_TABS.community })
            }}
          >
            {t('communityPools')}
          </Tab>
        </Tabs>

        <SmallDropdownInputGroup
          id='pool-filter'
          formatValue={formatValue}
          onValueSet={setChainFilter}
          currentValue={chainIdFilter}
          values={poolFilters}
        />
      </div>

      <ContentPane
        key='pools-list'
        isSelected={selectedTab === POOL_LIST_TABS.pools}
        onlyRenderOnSelect
      >
        <AnimatePresence exitBeforeEnter>
          <MotionUL
            key='ul-pool-list'
            animate={selectedTab === POOL_LIST_TABS.pools ? 'enter' : 'exit'}
          >
            <GovernancePoolsList chainIdFilter={chainIdFilter} />
          </MotionUL>
        </AnimatePresence>
      </ContentPane>

      <ContentPane
        key='community-list'
        isSelected={selectedTab === POOL_LIST_TABS.community}
        onlyRenderOnSelect
      >
        <AnimatePresence exitBeforeEnter>
          <MotionUL
            key='ul-community-list'
            animate={selectedTab === POOL_LIST_TABS.community ? 'enter' : 'exit'}
          >
            <CommunityPoolsList chainIdFilter={chainIdFilter} />
          </MotionUL>
        </AnimatePresence>
      </ContentPane>
    </div>
  )
}

const CommunityPoolsList = (props) => {
  const { data: communityPools, isFetched } = useCommunityPools()
  const { t } = useTranslation()

  return (
    <>
      <PoolList pools={communityPools} isFetched={isFetched} chainIdFilter={props.chainIdFilter} />
      <div className='flex'>
        <a
          href='https://community.pooltogether.com'
          target='_blank'
          className='mx-auto text-xxs xs:text-xs sm:text-sm text-center underline my-4'
        >
          {t('allPoolsAreListedOnCommunityDotPTDotCom')}
        </a>
      </div>
    </>
  )
}

const GovernancePoolsList = (props) => {
  const { data: pools, isFetched } = useGovernancePools()
  return <PoolList pools={pools} isFetched={isFetched} chainIdFilter={props.chainIdFilter} />
}

const MotionUL = (props) => {
  const shouldReduceMotion = useReducedMotion()

  const sharedListProps = {
    className: 'flex flex-col text-xs sm:text-lg lg:text-xl',
    initial: {
      scale: 0,
      y: -100,
      opacity: 0
    },
    variants: ANIM_LIST_VARIANTS(shouldReduceMotion)
  }

  return (
    <motion.ul {...props} {...sharedListProps}>
      {props.children}
    </motion.ul>
  )
}

const SmallDropdownInputGroup = (props) => {
  return (
    <DropdownInputGroup
      {...props}
      backgroundClasses='bg-tertiary'
      textClasses='text-accent-2 text-xs xs:text-sm  trans'
      roundedClasses='rounded-lg'
      paddingClasses='py-2 px-4'
      containerClassName='w-full xs:w-1/2 sm:w-96'
      iconSizeClasses='w-6 h-6'
    />
  )
}

const PoolList = (props) => {
  const { t } = useTranslation()

  const { pools, isFetched, chainIdFilter } = props

  const poolsToRender = useMemo(
    () =>
      pools
        ?.sort((a, b) => Number(b.prize.totalValueUsd) - Number(a.prize.totalValueUsd))
        .filter((pool) => filterByChainId(pool, chainIdFilter))
        .map((pool) => <PoolRow key={`pool-row-${pool.prizePool.address}`} pool={pool} />) || [],
    [pools, chainIdFilter]
  )

  if (!isFetched) return <PoolsListUILoader />

  return (
    <div>
      <ul>
        {poolsToRender}
        {poolsToRender.length === 0 && (
          <div className='flex flex-col'>
            <span className='mt-10 mx-auto text-accent-1'>
              {t('noBlankPoolsYet', { networkName: getNetworkNiceNameByChainId(chainIdFilter) })}
            </span>
          </div>
        )}
      </ul>
    </div>
  )
}

const filterByChainId = (pool, chainIdFilter) => {
  if (chainIdFilter === ALL_NETWORKS_ID) return true
  return pool.chainId === chainIdFilter
}

const usePoolFilters = () => {
  const chainIds = useEnvChainIds()
  const { t } = useTranslation()
  return chainIds.reduce(
    (allFilters, chainId) => {
      allFilters[chainId] = {
        value: chainId,
        view: (
          <>
            <NetworkIcon sizeClasses='my-auto h-6 w-6' chainId={chainId} />
            <span className='capitalize ml-2'>{getNetworkNiceNameByChainId(chainId)}</span>
          </>
        )
      }
      return allFilters
    },
    { [-1]: { view: t('allNetworks'), value: null } }
  )
}
