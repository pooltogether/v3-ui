import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { orderBy } from 'lodash'

import { useTranslation } from 'lib/../i18n'
import { PoolRowNew } from 'lib/components/PoolRowNew'
import { Tabs, Tab, ContentPane } from 'lib/components/Tabs'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'

const POOL_LIST_TABS = {
  pools: 'pools',
  community: 'community'
}

export const PoolList = (props) => {
  const { pools, communityPools } = props

  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState(POOL_LIST_TABS.pools)

  const shouldReduceMotion = useReducedMotion()

  const ANIM_LIST_VARIANTS = {
    enter: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.2,
        staggerChildren: shouldReduceMotion ? 0 : 0.5,
        delayChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
    exit: {
      scale: 0,
      y: -100,
      opacity: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
        staggerDirection: -1,
      },
    },
  }

  // const { pool } = usePool(newPool.symbol)

  console.log(communityPools?.[0]?.totalPrizeAmountUSD)
  const communityPoolsSorted = orderBy(communityPools, ['totalPrizeAmountUSD'], ['desc'])

  return (
    <>
      <Tabs>
        <Tab
          isSelected={selectedTab === POOL_LIST_TABS.pools}
          onClick={() => { setSelectedTab(POOL_LIST_TABS.pools) }}
        >
          {t('pools')}
        </Tab>
        <Tab
          isSelected={selectedTab === POOL_LIST_TABS.community}
          onClick={() => { setSelectedTab(POOL_LIST_TABS.community) }}
        >
          {t('community')}
        </Tab>
      </Tabs>
      
      <AnimatePresence exitBeforeEnter>
        <ContentPane key='pools-list' isSelected={selectedTab === POOL_LIST_TABS.pools}>
          <motion.ul
            key='pool-list'
            className='flex flex-col text-xs sm:text-lg lg:text-xl'
            animate={selectedTab === POOL_LIST_TABS.pools ? 'enter' : 'exit'}
            initial={{
              scale: 0,
              y: -100,
              opacity: 0,
            }}
            variants={ANIM_LIST_VARIANTS}
          >
            {pools?.map((pool) => {
              if (!pool?.id) {
                return null
              }

              return <PoolRowNew key={`pool-row-${pool.id}`} querySymbol={pool.symbol} />
            })}
          </motion.ul>
        </ContentPane>
      </AnimatePresence>

      <AnimatePresence exitBeforeEnter>
        <ContentPane key='community-list' isSelected={selectedTab === POOL_LIST_TABS.community}>
          <motion.ul
            key='pool-list'
            className='flex flex-col text-xs sm:text-lg lg:text-xl'
            animate={selectedTab === POOL_LIST_TABS.community ? 'enter' : 'exit'}
            initial={{
              scale: 0,
              y: -100,
              opacity: 0,
            }}
            variants={ANIM_LIST_VARIANTS}
          >
            {communityPoolsSorted?.map((pool) => {
              if (!pool?.id) {
                return null
              }

              return <PoolRowNew key={`pool-row-${pool.id}`} querySymbol={pool.symbol} />
            })}
          </motion.ul>
        </ContentPane>
        
      </AnimatePresence>
    </>
  )
}
