import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { POOL_LIST_TABS } from 'lib/constants'
import { ANIM_LIST_VARIANTS } from 'lib/constants/framerAnimations'
import { PoolRowNew } from 'lib/components/PoolRowNew'
import { Tabs, Tab, ContentPane } from 'lib/components/Tabs'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { PoolsListUILoader } from 'lib/components/loaders/PoolsListUILoader'
import { useCommunityPools, useGovernancePools } from 'lib/hooks/usePools'

export const PoolLists = () => {
  const { t } = useTranslation()
  const router = useRouter()

  // Don't switch back to the default tab if we're navigating away from the homepage
  const defaultTab = router.pathname === '/' && POOL_LIST_TABS.pools
  const selectedTab = router.query.tab || defaultTab

  return (
    <div className='mt-10'>
      <div className='flex flex-col justify-center items-center text-xs sm:text-lg lg:text-xl'>
        <Tabs className='mb-4'>
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
            <GovernancePoolsList />
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
            <CommunityPoolsList />
          </MotionUL>
        </AnimatePresence>
      </ContentPane>
    </div>
  )
}

const CommunityPoolsList = () => {
  const { t } = useTranslation()
  const { data: communityPools, isFetched } = useCommunityPools()

  return (
    <>
      <PoolList pools={communityPools} isFetched={isFetched} />
      <div className='flex'>
        <a
          href='https://community.pooltogether.com'
          target='_blank'
          className='mx-auto text-sm underline my-4'
        >
          {t('allPoolsAreListedOnCommunityDotPTDotCom')}
        </a>
      </div>
    </>
  )
}

const GovernancePoolsList = (props) => {
  const { data: pools, isFetched } = useGovernancePools()
  return <PoolList pools={pools} isFetched={isFetched} />
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

const PoolList = (props) => {
  const { pools, isFetched } = props
  if (!isFetched) return <PoolsListUILoader />
  return (
    <div>
      <ul>
        {/* TODO: Actual sorting! */}
        {pools
          .sort((a, b) => Number(b.prize.totalValueUsd) - Number(a.prize.totalValueUsd))
          .map((pool) => (
            <PoolRowNew key={`pool-row-${pool.prizePool.address}`} pool={pool} />
          ))}
      </ul>
    </div>
  )
}
