import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

import { ANIM_BANNER_VARIANTS } from 'lib/constants/framerAnimations'
import { Meta } from 'lib/components/Meta'
import { POOL_LIST_TABS } from 'lib/constants'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { CommunityDisclaimerBanner } from 'lib/components/CommunityDisclaimerBanner'
import { PoolLists } from 'lib/components/PoolLists'
import { RetroactivePoolClaimBanner } from 'lib/components/RetroactivePoolClaimBanner'
import { TVLAndWeeklyPrizesBanner } from 'lib/components/TVLAndWeeklyPrizesBanner'

import CompSvg from 'assets/images/comp.svg'

const BannerMotionDIV = (props) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      {...props}
      className='flex flex-col justify-center items-center text-xs sm:text-lg lg:text-xl'
      variants={ANIM_BANNER_VARIANTS(shouldReduceMotion)}
      initial={{
        scale: 0,
        opacity: 1
      }}
      style={{ originY: '60px' }}
    >
      {props.children}
    </motion.div>
  )
}

export const IndexUI = (props) => {
  const { t } = useTranslation()

  const router = useRouter()
  // Don't switch back to the default tab if we're navigating away from the homepage
  const defaultTab = router.pathname === '/' && POOL_LIST_TABS.pools
  const selectedTab = router.query.tab || defaultTab

  return (
    <>
      <Meta title={t('pools')} />

      <RetroactivePoolClaimBanner />

      <div className='relative h-40'>
        <div className='absolute t-0 l-0 r-0'>
          <BannerMotionDIV
            key='tvl-banner'
            animate={selectedTab === POOL_LIST_TABS.pools ? 'enter' : 'exit'}
          >
            <TVLAndWeeklyPrizesBanner />
          </BannerMotionDIV>
          <BannerMotionDIV
            key='community-disclaimer-banner'
            animate={selectedTab === POOL_LIST_TABS.community ? 'enter' : 'exit'}
          >
            <CommunityDisclaimerBanner />
          </BannerMotionDIV>
        </div>
      </div>

      <PoolLists />
    </>
  )
}
