import React from 'react'
import { Banner } from 'lib/components/Banner'
import { BannerUILoader } from 'lib/components/loaders/BannerUILoader'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

import Rocket from 'images/rocketship@2x.png'
import { usePooltogetherTotalPrizes, usePooltogetherTvl } from 'lib/hooks/usePooltogetherTvl'

export const TVLAndWeeklyPrizesBanner = (props) => {
  const { t } = useTranslation()

  const totalValueLocked = usePooltogetherTvl()
  const totalPrizes = usePooltogetherTotalPrizes()

  const formatNumbers = (num) => {
    if (num > 1000000) {
      return `$${numberWithCommas(num / 1000000, { precision: 2 })} ${t('million')}`
    } else if (num > 100000) {
      return `$${numberWithCommas(num, { precision: 0 })}`
    } else {
      return `$${numberWithCommas(num, { precision: 2 })}`
    }
  }

  // Check if data has loaded
  if (totalValueLocked === null || totalPrizes === null) {
    return <BannerUILoader />
  }

  const totalPrizeFormatted = formatNumbers(totalPrizes)
  const totalValueLockedFormatted = formatNumbers(totalValueLocked)

  return (
    <Banner
      gradient={'purple-pink'}
      className='absolute t-0 l-0 r-0 shadow-md mt-1 mb-8 flex flex-row items-center'
      style={{ minHeight: 150 }}
    >
      <Image
        src={Rocket}
        className='mr-4 xs:mr-4 xs:ml-4 my-auto w-12 h-12 xs:w-20 xs:h-20 sm:ml-auto'
      />

      <h4 className='text-white sm:leading-tight text-xs xs:text-lg sm:text-xl lg:text-2xl sm:w-9/12 lg:w-9/12 sm:mr-auto'>
        {t(`currentTvlAndPrize`, {
          tvl: totalValueLockedFormatted,
          prize: totalPrizeFormatted
        })}
      </h4>
    </Banner>
  )
}
