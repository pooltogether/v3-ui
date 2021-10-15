import React from 'react'
import { motion } from 'framer-motion'

import { ANIM_BANNER_VARIANTS } from 'lib/constants/framerAnimations'
import { Meta } from 'lib/components/Meta'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { PoolLists } from 'lib/components/PoolLists'
import { RetroactivePoolClaimBanner } from 'lib/components/RetroactivePoolClaimBanner'
import { V4Banner } from 'lib/components/V4Banner'

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

  return (
    <>
      <Meta title={t('pools')} />

      <RetroactivePoolClaimBanner />

      <div className='relative h-40'>
        <div className='absolute t-0 l-0 r-0'>
          <BannerMotionDIV key='v4-banner' animate={'enter'}>
            <V4Banner />
          </BannerMotionDIV>
        </div>
      </div>

      <PoolLists />
    </>
  )
}
