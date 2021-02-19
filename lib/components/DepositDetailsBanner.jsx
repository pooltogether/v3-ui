import React from 'react'

import { Banner } from 'lib/components/Banner'
import { useRetroactivePoolClaimData } from 'lib/hooks/useRetroactivePoolClaimData'
import { useTotalPoolPrizeInterestUSD } from 'lib/hooks/useTotalPoolPrizeInterestUSD'
import { useTotalPoolPrizeValueLockedUSD } from 'lib/hooks/useTotalPoolPrizeValueLockedUSD'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { useTranslation } from 'lib/../i18n'

import Rocket from 'assets/images/rocket.svg'

export const DepositDetailsBanner = (props) => {
  const { t } = useTranslation()

  const { data: retroData, loading } = useRetroactivePoolClaimData()
  const [totalValueLocked, totalPrizePoolValueLockedIsFetched] = useTotalPoolPrizeValueLockedUSD()
  const {
    data: totalPrizeInterestUSD,
    isFetched: totalPrizeIsFetched
  } = useTotalPoolPrizeInterestUSD()

  const formatNumbers = (num) => {
    if (num > 1000000) {
      return `$${numberWithCommas(num / 1000000, { precision: 2 })} ${t('million')}`
    } else {
      return `$${numberWithCommas(num, { precision: 2 })}`
    }
  }

  // Check if retro banner is showing
  if (loading || (!retroData?.isClaimed && !retroData?.isMissing)) {
    console.log('here', retroData)
    return null
  }

  // Check if data has loaded
  if (!totalPrizeIsFetched || !totalPrizePoolValueLockedIsFetched) {
    return null
  }

  const totalPrizeFormatted = formatNumbers(totalPrizeInterestUSD)
  const totalValueLockedFormatted = formatNumbers(totalValueLocked)

  return (
    <Banner gradient={'purple-pink'} className='shadow-md mt-8 mb-8 flex flex-row'>
      <img src={Rocket} className='mr-4 xs:mr-8 xs:ml-4 my-auto w-20 h-20' />
      <h4 className='text-white'>
        {t(`currentTvlAndPrize`, { tvl: totalValueLockedFormatted, prize: totalPrizeFormatted })}
      </h4>
    </Banner>
  )
}
