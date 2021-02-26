import React from 'react'

import { Banner } from 'lib/components/Banner'
import { useTranslation } from 'lib/../i18n'

import Rocket from 'assets/images/rocketship@2x.png'

export const CommunityDisclaimerBanner = (props) => {
  const { t } = useTranslation()

  return (
    <Banner gradient={'purple-pink'} className='absolute t-0 l-0 r-0 shadow-md mt-1 mb-8 flex flex-row items-center'>
      <img src={Rocket} className='mr-4 xs:mr-4 xs:ml-4 my-auto w-12 h-12 xs:w-20 xs:h-20' />
      
      <h4 className='text-white sm:leading-tight text-xs xs:text-lg sm:text-xl lg:text-2xl'>
        Disclaimer
      </h4>
    </Banner>
  )
}
