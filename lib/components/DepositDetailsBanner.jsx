import React, { useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { Banner } from 'lib/components/Banner'
import { useRetroactivePoolClaimData } from 'lib/hooks/useRetroactivePoolClaimData'
import { useTotalPoolPrizeInterestUSD } from 'lib/hooks/useTotalPoolPrizeInterestUSD'
import { useTotalPoolPrizeValueLockedUSD } from 'lib/hooks/useTotalPoolPrizeValueLockedUSD'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { useTranslation } from 'lib/../i18n'

import Rocket from 'assets/images/rocket.svg'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'

export const DepositDetailsBanner = (props) => {
  const { t } = useTranslation()

  const { usersAddress } = useContext(AuthControllerContext)
  const { data: retroData, loading } = useRetroactivePoolClaimData()
  const [totalValueLocked, totalPrizePoolValueLockedIsFetched] = useTotalPoolPrizeValueLockedUSD()
  const {
    data: totalPrizeInterestUSD,
    isFetched: totalPrizeIsFetched
  } = useTotalPoolPrizeInterestUSD()
  const shouldReduceMotion = useReducedMotion()

  const formatNumbers = (num) => {
    if (num > 1000000) {
      return `$${numberWithCommas(num / 1000000, { precision: 2 })} ${t('million')}`
    } else if (num > 100000) {
      return `$${numberWithCommas(num, { precision: 0 })}`
    } else {
      return `$${numberWithCommas(num, { precision: 2 })}`
    }
  }

  // Check if retro banner is showing
  if ((loading && usersAddress) || (retroData && !retroData?.isClaimed && !retroData?.isMissing)) {
    return null
  }

  // Check if data has loaded
  if (!totalPrizeIsFetched || !totalPrizePoolValueLockedIsFetched) {
    return null
  }

  const totalPrizeFormatted = formatNumbers(totalPrizeInterestUSD)
  const totalValueLockedFormatted = formatNumbers(totalValueLocked)

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.ul
        key='tvl-banner'
        className='flex flex-col text-xs sm:text-lg lg:text-xl'
        initial={{
          scale: 0,
          y: -100,
          opacity: 0
        }}
        animate={{
          scale: 1,
          y: 0,
          opacity: 1,
          transition: {
            duration: shouldReduceMotion ? 0 : 0.2,
            staggerChildren: shouldReduceMotion ? 0 : 0.5,
            delayChildren: shouldReduceMotion ? 0 : 0.2
          }
        }}
        exit={{
          scale: 0,
          y: -100,
          opacity: 0,
          transition: {
            duration: shouldReduceMotion ? 0 : 0.8,
            staggerChildren: shouldReduceMotion ? 0 : 0.05,
            staggerDirection: -1
          }
        }}
      >
        <Banner gradient={'purple-pink'} className='shadow-md mt-1 mb-8 flex flex-row'>
          <img src={Rocket} className='mr-4 xs:mr-8 xs:ml-4 my-auto w-20 h-20' />
          <h4 className='text-white'>
            {t(`currentTvlAndPrize`, {
              tvl: totalValueLockedFormatted,
              prize: totalPrizeFormatted
            })}
          </h4>
        </Banner>
      </motion.ul>
    </AnimatePresence>
  )
}
