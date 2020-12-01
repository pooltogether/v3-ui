import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { HeaderLogo } from 'lib/components/HeaderLogo'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'

export function ErrorPage() {
  const { t } = useTranslation()

  return <>
    <React.Fragment>
      <div
        className='flex flex-col w-full'
        style={{
          minHeight: '100vh'
        }}
      >
        <div
          className='header fixed w-full bg-body z-30 pt-1 pb-1 xs:pt-2 xs:pb-0 sm:py-0 mx-auto l-0 r-0'
        >
          <div className='flex justify-center items-center px-4 xs:px-12 sm:px-10 py-4 xs:pb-6 sm:pt-5 sm:pb-7 mx-auto'>
            <HeaderLogo />
          </div>
        </div>

        <div className='grid-wrapper'>
          <div className='content'>
            <div className='my-0 text-inverse sm:pt-2 lg:pt-4'>
              <PageTitleAndBreadcrumbs
                title={`${t('error')}`}
                breadcrumbs={[]}
              />

              <h3>
                {t('anErrorOccurredAndWeveBeenNotified')}
              </h3>
              <h5>
                {t('pleaseTryAgainSoon')}
              </h5>
            </div>
          </div>
        </div>

      </div>
    </React.Fragment>
  </>
}