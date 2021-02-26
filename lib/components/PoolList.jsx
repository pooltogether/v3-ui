import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// import { orderBy } from 'lodash'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { ANIM_LIST_VARIANTS, POOL_LIST_TABS } from 'lib/constants'
import { PoolRowNew } from 'lib/components/PoolRowNew'
import { Tabs, Tab, ContentPane } from 'lib/components/Tabs'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

const MotionUL = (props) => {
  const shouldReduceMotion = useReducedMotion()
  
  const sharedListProps = {
    className: 'flex flex-col text-xs sm:text-lg lg:text-xl',
    initial: {
      scale: 0,
      y: -100,
      opacity: 0,
    },
    variants: ANIM_LIST_VARIANTS(shouldReduceMotion)
  }
  
  return (
    <motion.ul
      {...props}
      {...sharedListProps}
    >
      {props.children}
    </motion.ul>
  )
}

export const PoolList = (props) => {
  const { pools, communityPools } = props

  const { t } = useTranslation()
  const router = useRouter()
  const selectedTab = router.query.tab || POOL_LIST_TABS.pools

  // const communityPoolsSorted = orderBy(communityPools, ['totalPrizeAmountUSD'], ['desc'])
  // TODO: To be replaced by automated sorting based on prize size
  //       also note this array is in reverse order of how we want the elements to appear in the list
  //       due to the -1 returned by all the other pools in the sortFunction's indexOf() calls
  const hardcodedSortOrder = [
    '0x3e2e88f6eaa189e397bf87153e085a757028c069', // BONDLY
    '0x9f7905c7bd5ec9e870ed50f0e286f2742c19f5b3', // DPI
    '0xf6d6b30d31077db8590fe1bea7a293e1515f8152', // RAI
    '0xea7eaecbff99ce2412e794437325f3bd225ee78f', // BOND
  ]
  
  const communityPoolsSorted = communityPools.sort((a, b) => {
    return hardcodedSortOrder.indexOf(b.id) - hardcodedSortOrder.indexOf(a.id)
  })

  return (
    <>
      <Tabs>
        <Tab
          isSelected={selectedTab === POOL_LIST_TABS.pools}
          onClick={() => {
            queryParamUpdater.add(router, { 'tab': POOL_LIST_TABS.pools })
          }}
        >
          {t('pools')}
        </Tab>
        <Tab
          isSelected={selectedTab === POOL_LIST_TABS.community}
          onClick={() => {
            queryParamUpdater.add(router, { 'tab': POOL_LIST_TABS.community })
          }}
        >
          {t('communityPools')}
        </Tab>
      </Tabs>
      
      <ContentPane key='pools-list' isSelected={selectedTab === POOL_LIST_TABS.pools}>
        <AnimatePresence exitBeforeEnter>
          <MotionUL
            key='ul-pool-list'
            animate={selectedTab === POOL_LIST_TABS.pools ? 'enter' : 'exit'}
          >
            {pools?.map((pool) => {
              if (!pool?.id) { return null }

              return <PoolRowNew key={`pool-row-${pool.id}`} querySymbol={pool.symbol} />
            })}
          </MotionUL>
        </AnimatePresence>
      </ContentPane>

      <ContentPane key='community-list' isSelected={selectedTab === POOL_LIST_TABS.community}>
        <AnimatePresence exitBeforeEnter>
          <MotionUL
            key='ul-community-list'
            animate={selectedTab === POOL_LIST_TABS.community ? 'enter' : 'exit'}
          >
            {communityPoolsSorted?.map((pool) => {
              if (!pool?.id) { return null }

              return <PoolRowNew key={`pool-row-${pool.id}`} querySymbol={pool.symbol} />
            })}
          </MotionUL>
        </AnimatePresence>
      </ContentPane>
        
    </>
  )
}
