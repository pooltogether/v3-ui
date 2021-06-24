import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { Button } from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'

import { COOKIE_OPTIONS, WIZARD_REFERRER_HREF, WIZARD_REFERRER_AS_PATH } from 'lib/constants'
import { Banner } from 'lib/components/Banner'
import { useRetroactivePoolClaimData } from 'lib/hooks/useRetroactivePoolClaimData'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { useUsersAddress } from '@pooltogether/hooks'

export const RetroactivePoolClaimBanner = (props) => {
  const { t } = useTranslation()

  const router = useRouter()
  const usersAddress = useUsersAddress()
  const { data, loading } = useRetroactivePoolClaimData()

  if (loading || data?.isMissing || data?.isClaimed) {
    return null
  }

  const handleOpenClaimClick = (e) => {
    e.preventDefault()

    Cookies.set(WIZARD_REFERRER_HREF, window.location.pathname, COOKIE_OPTIONS)
    Cookies.set(WIZARD_REFERRER_AS_PATH, window.location.pathname, COOKIE_OPTIONS)

    queryParamUpdater.add(router, { claim: '1', address: usersAddress })
  }

  return (
    <Banner gradient={'rainbow'} className='mb-12'>
      <div className='flex sm:flex-row flex-col'>
        {/* <div className='mb-3 sm:mb-2 ml-0 mr-auto sm:mb-auto sm:mr-4 sm:mt-1'>
          <img className='shake' src={Bell} style={{ maxWidth: 30 }} />
        </div> */}
        <div className='sm:px-2'>
          <h6>{t('youCanClaimPool')}</h6>
          <p className='mt-1 mb-5 text-xs sm:text-sm w-full xs:w-10/12 sm:w-9/12'>
            {t('retroactivePoolBannerDescription')}
          </p>
          <Button
            // as={`?claim=1&address=${usersAddress}`}
            // href={`?claim=1&address=${usersAddress}`}
            type='button'
            className='w-full xs:w-auto'
            tertiary
            textSize='sm'
            onClick={handleOpenClaimClick}
          >
            {t('claimPool')}
          </Button>
        </div>
      </div>
    </Banner>
  )
}
