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

  // const communityPoolsSorted = orderBy(communityPools, ['totalPrizeAmountUSD'], ['desc'])
  // TODO: To be replaced by automated sorting based on prize size
  //       also note this array is in reverse order of how we want the elements to appear in the list
  //       due to the -1 returned by all the other pools in the sortFunction's indexOf() calls
  const hardcodedSortOrder = [
    '0x3e2e88f6eaa189e397bf87153e085a757028c069', // bondly
    '0x9f7905c7bd5ec9e870ed50f0e286f2742c19f5b3', // DPI
    '0xf6d6b30d31077db8590fe1bea7a293e1515f8152', // RAI
    '0xea7eaecbff99ce2412e794437325f3bd225ee78f', // bond
  ]
  
  const communityPoolsSorted = communityPools.sort((a, b) => {
    return hardcodedSortOrder.indexOf(b.id) - hardcodedSortOrder.indexOf(a.id)
  })


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
  const sharedListProps = {
    className: 'flex flex-col text-xs sm:text-lg lg:text-xl',
    initial: {
      scale: 0,
      y: -100,
      opacity: 0,
    },
    variants: ANIM_LIST_VARIANTS
  }

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
      
      <ContentPane key='pools-list' isSelected={selectedTab === POOL_LIST_TABS.pools}>
        <AnimatePresence exitBeforeEnter>
          <motion.ul
            {...sharedListProps}
            key='pool-list'
            animate={selectedTab === POOL_LIST_TABS.pools ? 'enter' : 'exit'}
          >
            {pools?.map((pool) => {
              if (!pool?.id) {
                return null
              }

              return <PoolRowNew key={`pool-row-${pool.id}`} querySymbol={pool.symbol} />
            })}
          </motion.ul>
        </AnimatePresence>
      </ContentPane>

      <ContentPane key='community-list' isSelected={selectedTab === POOL_LIST_TABS.community}>
        <AnimatePresence exitBeforeEnter>
          <motion.ul
            {...sharedListProps}
            key='pool-list'
            animate={selectedTab === POOL_LIST_TABS.community ? 'enter' : 'exit'}
          >
            {communityPoolsSorted?.map((pool) => {
              if (!pool?.id) {
                return null
              }

              return <PoolRowNew key={`pool-row-${pool.id}`} querySymbol={pool.symbol} />
            })}
          </motion.ul>
        </AnimatePresence>
      </ContentPane>
        
    </>
  )
}
