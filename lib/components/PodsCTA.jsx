import React from 'react'

import { useTranslation } from 'react-i18next'

export const PodsCTA = (props) => {
  const { t } = useTranslation()
  const { pool } = props

  const symbol = pool?.contract?.symbol
  const isMainnetDaiOrUsdc = pool?.chainId === 1 && (symbol === 'PT-cDAI' || symbol === 'PT-cUSDC')

  if (!isMainnetDaiOrUsdc) {
    return null
  }

  return (
    <p className='bg-body rounded-lg text-center mt-2 mb-10 py-2 text-xxs xs:text-sm'>
      {t('wantAHigherChanceToWin', 'Want a higher chance to win?')} 🐳{' '}
      <a className='text-green hover:text-inverse trans' href='https://pods.pooltogether.com'>
        {t('joinThePod', 'Join the Pod')}
      </a>
    </p>
  )
}
