import React from 'react'

import { useTranslation } from 'next-i18next'
import { EmailSignup } from 'lib/components/EmailSignup'

import IconEmail from 'assets/images/icon-glossy-email@2x.png'

export const AccountEmailSignup = () => {
  const { t } = useTranslation()

  return (
    <>
      <div className='xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-2 sm:px-6 py-3 mt-4 xs:mt-5'>
        <div className='flex justify-between flex-col xs:flex-row xs:pt-4 pb-0 px-2 xs:px-4'>
          <div className='flex-col order-2 xs:order-1 w-full'>
            <h6 className='flex items-center font-normal text-inverse'>
              {t('getPrizeWinningNotificationsByEmail')}
            </h6>

            <EmailSignup />
          </div>

          <div className='order-1 xs:order-2 ml-auto pl-10'>
            <img src={IconEmail} className='w-16 h-16 xs:w-20 mx-auto' />
          </div>
        </div>
      </div>
    </>
  )
}
