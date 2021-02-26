import React from 'react'

import { Banner } from 'lib/components/Banner'
import { useTranslation } from 'lib/../i18n'

import Bell from 'assets/images/bell-red@2x.png'

export const CommunityDisclaimerBanner = (props) => {
  const { t } = useTranslation()

  return (
    <Banner gradient={null} className='bg-functional-red absolute t-0 l-0 r-0 mt-1 mb-8 flex flex-row items-center'>
      <img src={Bell} className='mr-4 xs:mr-4 xs:ml-4 my-auto h-10 xs:h-10' />
      
      <h5 className='text-functional-red sm:leading-tight sm:ml-2'>
        <span className='font-normal'>{t('anyoneCanCreateAPrizePool')}</span>
        <br />{t('makeSureToDYORBeforeProceeding')}
      </h5>
    </Banner>
  )
}
