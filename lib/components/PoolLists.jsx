import React, { useState } from 'react'
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
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'
import { NetworkIcon } from 'lib/components/NetworkIcon'

export const PoolLists = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const poolFilters = usePoolFilters()
  const [chainIdFilter, setChainIdFilter] = useState('all')
  const formatValue = (key) => poolFilters[key].view

  // Don't switch back to the default tab if we're navigating away from the homepage
  const defaultTab = router.pathname === '/' && POOL_LIST_TABS.pools
  const selectedTab = router.query.tab || defaultTab

  return (
    <div className='mt-10'>
      <div className='flex flex-col xs:flex-row flex-col-reverse justify-between items-center text-xs sm:text-lg lg:text-xl'>
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
          onValueSet={setChainIdFilter}
          initial={chainIdFilter}
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
  const { pools, isFetched, chainIdFilter } = props

  if (!isFetched) return <PoolsListUILoader />

  return (
    <div>
      <ul>
        {/* TODO: Actual sorting! */}
        {pools
          .sort((a, b) => Number(b.prize.totalValueUsd) - Number(a.prize.totalValueUsd))
          .filter((pool) => filterByChainId(pool, chainIdFilter))
          .map((pool) => (
            <PoolRow key={`pool-row-${pool.prizePool.address}`} pool={pool} />
          ))}
      </ul>
    </div>
  )
}

const filterByChainId = (pool, chainIdFilter) => {
  if (chainIdFilter === 'all') return true
  return pool.chainId === Number(chainIdFilter)
}

const usePoolFilters = () => {
  const chainIds = useEnvChainIds()
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
    { all: { view: 'All Networks', value: null } }
  )
}
