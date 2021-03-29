import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { POOL_LIST_TABS } from 'lib/constants'
import { ANIM_LIST_VARIANTS } from 'lib/constants/framerAnimations'
import { PoolRowNew } from 'lib/components/PoolRowNew'
import { Tabs, Tab, ContentPane } from 'lib/components/Tabs'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { PoolsListUILoader } from 'lib/components/PoolsListUILoader'
import { useMultiversionCommunityPools } from 'lib/hooks/useMultiversionCommunityPools'
import { useMultiversionGovernancePools } from 'lib/hooks/useMultiversionGovernancePools'

export const PoolLists = () => {
  const shouldReduceMotion = useReducedMotion()

  const { t } = useTranslation()
  const router = useRouter()

  // Don't switch back to the default tab if we're navigating away from the homepage
  const defaultTab = router.pathname === '/' && POOL_LIST_TABS.pools
  const selectedTab = router.query.tab || defaultTab

  return (
    <div className='mt-10'>
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
  const { communityPools, communityPoolsDataLoading } = useMultiversionCommunityPools()

  const communityPoolsSorted = useMemo(() => {
    // TODO: To be replaced by automated sorting based on prize size
    //       also note this array is in reverse order of how we want the elements to appear in the list
    //       due to the -1 returned by all the other pools in the sortFunction's indexOf() calls
    const hardcodedSortOrder = [
      '0x55ab6e07fb3ae2598fe463ea4dcf872a006fec77', // ARTO
      '0xa56c5a83be478ab970f5aa434c90ff02f5eac275', // LON
      '0x21beeb7f098ade12205d19c92d93720bb5284660', // BADGER
      '0x22044abdc99feea72dc62de2063c592401baf9a7', // IDT
      '0x0381ae77a89e817c2f4db2cbed51dd3af67da009', // BAT
      '0xdf19f2f606dcc5849199594e77058898a7caa73d', // ZRX-0xdf19f2
      '0xf6d6b30d31077db8590fe1bea7a293e1515f8152', // RAI
      '0x5864029ce3e5acabab2ca1c9fe6fe06ba5cae624', // BTC
      '0x1c19eac22545949a428321d046356422035a32d6', // EM3
      '0xac61998febebcdfdc0ab4283cb843148cd32b8c5', // BONDLY
      '0x639d4140a1f7723b7cefef7505d1d7be11a43de0', // UNI-V2
      '0x9f7905c7bd5ec9e870ed50f0e286f2742c19f5b3', // DPI
      '0x396b4489da692788e327e2e4b2b0459a5ef26791', // POOL
      '0xea7eaecbff99ce2412e794437325f3bd225ee78f' // BOND
    ]
    return communityPools.sort((a, b) => {
      return hardcodedSortOrder.indexOf(b.id) - hardcodedSortOrder.indexOf(a.id)
    })
  }, [communityPools])

  if (communityPoolsDataLoading) return <PoolsListUILoader />

  return (
    <>
      {communityPoolsSorted.map((pool) => {
        if (!pool?.id) {
          return null
        }

        return <PoolRowNew key={`pool-row-${pool.id}`} querySymbol={pool.symbol} />
      })}
    </>
  )
}

const GovernancePoolsList = (props) => {
  const { pools, poolsDataLoading } = useMultiversionGovernancePools()

  const governancePoolsSorted = useMemo(() => {
    // TODO: To be replaced by automated sorting based on prize size
    //       also note this array is in reverse order of how we want the elements to appear in the list
    //       due to the -1 returned by all the other pools in the sortFunction's indexOf() calls
    const hardcodedSortOrder = [
      '0x0650d780292142835f6ac58dd8e2a336e87b4393', // UNI
      '0xbc82221e131c082336cf698f0ca3ebd18afd4ce7', // COMP
      '0x396b4489da692788e327e2e4b2b0459a5ef26791', // POOL
      '0xde9ec95d7708b8319ccca4b8bc92c0a3b70bf416', // USDC
      '0xebfb47a7ad0fd6e57323c8a42b2e5a6a4f68fc1a' // DAI
    ]
    return pools.sort((a, b) => {
      return hardcodedSortOrder.indexOf(b.id) - hardcodedSortOrder.indexOf(a.id)
    })
  }, [pools])

  if (poolsDataLoading) return <PoolsListUILoader />

  return (
    <>
      {governancePoolsSorted.map((pool) => {
        if (!pool?.id) {
          return null
        }

        return <PoolRowNew key={`pool-row-${pool.id}`} querySymbol={pool.symbol} />
      })}
    </>
  )
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
