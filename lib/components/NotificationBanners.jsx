import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { useAllPools } from '@pooltogether/hooks'
import { useAtom, atom } from 'jotai'

import { useChecklyStatus } from 'lib/hooks/useChecklyStatus'
import { useTranslation } from 'react-i18next'

export const notificationBannerVisibleAtom = atom(false)

export const NotificationBanners = (props) => {
  return (
    <div className='flex flex-col w-full t-0 z-50'>
      <ChecklyNotificationBanner />
    </div>
  )
}

export const NotificationBanner = (props) => {
  const { canClose } = props

  const [userHasClosedBanner, setUserHasClosedBanner] = useState(false)

  if (userHasClosedBanner) return null

  return (
    <div
      className={classnames('z-50 flex relative', props.className, {
        'text-center': !props.noCenter
      })}
    >
      <div className='max-w-screen-lg sm:px-6 py-2 sm:py-3 mx-auto flex-grow px-8'>
        {props.children}
      </div>
      {canClose && <CloseBannerButton closeBanner={() => setUserHasClosedBanner(true)} />}
    </div>
  )
}

export const CloseBannerButton = (props) => (
  <button
    className='absolute r-1 t-1 opacity-70 hover:opacity-100 cursor-pointer trans'
    onClick={() => props.closeBanner()}
  >
    <FeatherIcon icon='x' className='h-4 w-4 sm:h-6 sm:w-6' />
  </button>
)

// Banners

const ChecklyNotificationBanner = () => {
  const { t } = useTranslation()

  const { data: checklyStatus, isFetched: isChecklyFetched } = useChecklyStatus()
  const { error } = useAllPools()

  const isVisible = (isChecklyFetched && checklyStatus?.hasErrors) || error
  const [, setNotificationBannerVisible] = useAtom(notificationBannerVisibleAtom)
  useEffect(() => {
    setNotificationBannerVisible(isVisible)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <NotificationBanner className='bg-warning-red text-xxs xs:text-xxs sm:text-xs text-inverse'>
      <b>{t('warning')}:</b>
      <span className='mx-1'>{t('dataProvidersAreDownWarning')}</span>
      <a
        className='text-inverse underline hover:opacity-70 trans'
        href='https://status.pooltogether.com/'
        target='_blank'
        rel='noopener noreferrer'
      >
        {t('moreInfo')}.
      </a>
    </NotificationBanner>
  )
}
