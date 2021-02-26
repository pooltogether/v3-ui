import React, { useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { Banner } from 'lib/components/Banner'
import { useRetroactivePoolClaimData } from 'lib/hooks/useRetroactivePoolClaimData'
import { useTotalPoolPrizeInterestUSD } from 'lib/hooks/useTotalPoolPrizeInterestUSD'
import { useTotalPoolPrizeValueLockedUSD } from 'lib/hooks/useTotalPoolPrizeValueLockedUSD'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { useTranslation } from 'lib/../i18n'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'

import Rocket from 'assets/images/rocketship@2x.png'

export const TVLAndWeeklyPrizesBanner = (props) => {
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
    <Banner gradient={'purple-pink'} className='absolute t-0 l-0 r-0 shadow-md mt-1 mb-8 flex flex-row items-center'>
      <img src={Rocket} className='mr-4 xs:mr-4 xs:ml-4 my-auto w-12 h-12 xs:w-20 xs:h-20' />
      
      <h4 className='text-white sm:leading-tight text-xs xs:text-lg sm:text-xl lg:text-2xl'>
        {t(`currentTvlAndPrize`, {
          tvl: totalValueLockedFormatted,
          prize: totalPrizeFormatted
        })}
      </h4>
    </Banner>
  )
}