import React, { useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { useChecklyStatus } from 'lib/hooks/useChecklyStatus'

export const NotificationBanners = (props) => {
  return <div className='flex flex-col w-full t-0 z-50'>{/* <ChecklyNotificationBanner /> */}</div>
}

export const NotificationBanner = (props) => {
  const { canClose } = props

  const [userHasClosedBanner, setUserHasClosedBanner] = useState(false)

  if (userHasClosedBanner) return null

  return (
    <div
      className={classnames(
        'text-center text-sm sm:text-base text-white z-50 flex relative',
        props.className
      )}
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
  useChecklyStatus()
  return <NotificationBanner className='bg-red'>Hey</NotificationBanner>
}
