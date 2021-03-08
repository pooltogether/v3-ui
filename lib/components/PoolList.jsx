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

export const PoolList = (props) => {
  const { pools, communityPools } = props

  const shouldReduceMotion = useReducedMotion()

  const { t } = useTranslation()
  const router = useRouter()
  // Don't switch back to the default tab if we're navigating away from the homepage
  const defaultTab = router.pathname === '/' && POOL_LIST_TABS.pools
  const selectedTab = router.query.tab || defaultTab

  // const communityPoolsSorted = orderBy(communityPools, ['totalPrizeAmountUSD'], ['desc'])
  // TODO: To be replaced by automated sorting based on prize size
  //       also note this array is in reverse order of how we want the elements to appear in the list
  //       due to the -1 returned by all the other pools in the sortFunction's indexOf() calls
  const hardcodedSortOrder = [
    '0x55ab6e07fb3ae2598fe463ea4dcf872a006fec77', // ARTO
    '0x22044abdc99feea72dc62de2063c592401baf9a7', // IDT
    '0xf6d6b30d31077db8590fe1bea7a293e1515f8152', // RAI
    '0x1c19eac22545949a428321d046356422035a32d6', // EM3
    '0xa56c5a83be478ab970f5aa434c90ff02f5eac275', // LON
    '0xac61998febebcdfdc0ab4283cb843148cd32b8c5', // BONDLY
    '0xdf19f2f606dcc5849199594e77058898a7caa73d', // ZRX-0xdf19f2
    '0x9f7905c7bd5ec9e870ed50f0e286f2742c19f5b3', // DPI
    '0xea7eaecbff99ce2412e794437325f3bd225ee78f' // BOND
  ]

  const communityPoolsSorted = communityPools.sort((a, b) => {
    return hardcodedSortOrder.indexOf(b.id) - hardcodedSortOrder.indexOf(a.id)
  })

  return (
    <>
      <motion.div
        animate='enter'
        className='flex flex-col justify-center items-center text-xs sm:text-lg lg:text-xl'
        variants={ANIM_LIST_VARIANTS(shouldReduceMotion)}
        initial={{
          scale: 0,
          opacity: 1
        }}
        style={{ originY: '60px' }}
      >
        <Tabs>
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
      </motion.div>

      <ContentPane key='pools-list' isSelected={selectedTab === POOL_LIST_TABS.pools}>
        <AnimatePresence exitBeforeEnter>
          <MotionUL
            key='ul-pool-list'
            animate={selectedTab === POOL_LIST_TABS.pools ? 'enter' : 'exit'}
          >
            {pools?.map((pool) => {
              if (!pool?.id) {
                return null
              }

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
              if (!pool?.id) {
                return null
              }

              return <PoolRowNew key={`pool-row-${pool.id}`} querySymbol={pool.symbol} />
            })}
          </MotionUL>
        </AnimatePresence>
      </ContentPane>
    </>
  )
}
