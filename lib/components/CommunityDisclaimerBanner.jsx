import React from 'react'

import { Banner } from 'lib/components/Banner'
import { Trans, useTranslation } from 'react-i18next'

import Bell from 'assets/images/bell@2x.png'

export const CommunityDisclaimerBanner = (props) => {
  const { t } = useTranslation()

  return (
    <Banner
      gradient={null}
      className='bg-functional-red absolute t-0 l-0 r-0 mt-1 mb-8 flex flex-row items-center'
      style={{ minHeight: 150 }}
    >
      <div className='mr-4 xs:mr-4 xs:ml-4 my-auto h-12'>
        <img className='shake' src={Bell} style={{ maxWidth: 40 }} />
      </div>

      <div className='text-inverse sm:leading-tight sm:ml-2 text-xs xs:text-sm sm:text-lg lg:text-xl'>
        <span className='font-bold'>{t('anyoneCanCreateAPrizePool')}</span>
        <br />
        <Trans
          i18nKey='learnAboutCommunityPrizePoolsHere'
          defaults='Learn about community prize pools <a>here</a>'
          components={{
            a: (
              <a
                target='_blank'
                className='underline text-inverse'
                href='https://medium.com/pooltogether/prize-pool-builder-9f9c95fad860'
              />
            )
          }}
        />
      </div>
    </Banner>
  )
}
