import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Meta } from 'lib/components/Meta'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { HeaderLogo } from '@pooltogether/react-components'

export function ErrorPage() {
  const { t } = useTranslation()

  return (
    <>
      <Meta title='PoolTogether' />

      <div
        className='flex flex-col w-full'
        style={{
          minHeight: '100vh'
        }}
      >
        <div className='header fixed w-full bg-body z-30 pt-1 pb-1 xs:pt-2 xs:pb-0 sm:py-0 mx-auto l-0 r-0'>
          <div className='flex justify-center items-center px-4 xs:px-12 sm:px-10 py-4 xs:pb-6 sm:pt-5 sm:pb-7 mx-auto'>
            <HeaderLogo />
          </div>
        </div>

        <div className='content mx-auto' style={{ maxWidth: 700 }}>
          <div className='my-0 text-inverse pt-32 px-6 xs:pt-32 xs:px-20'>
            <PageTitleAndBreadcrumbs title={`${t('error')}`} breadcrumbs={[]} />

            <h6 className='leading-tight'>{t('anErrorOccurredAndWeveBeenNotified')}</h6>
            <h5 className='my-10 text-orange'>{t('dontWorryYourFundsAreSafe')}</h5>
            <h6 className='mt-8'>
              <Trans
                i18nKey='tryAgainSoonOrTryAnAlternativeUI'
                defaults='Please try again soon or try an alternative interface like <linkToCommunity>community.pooltogether.com</linkToCommunity>'
                components={{
                  linkToCommunity: <a href='https://community.pooltogether.com' target='_blank' />
                }}
              />
            </h6>
          </div>
        </div>
      </div>
    </>
  )
}
