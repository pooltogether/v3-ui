import React from 'react'
import { useTranslation } from 'lib/../i18n'

export const PodsCTA = (props) => {
  const { t } = useTranslation()
  const { pool } = props

  const symbol = pool?.contract?.symbol
  const isMainnetDaiOrUsdc = pool?.chainId === 1 && (symbol === 'PT-cDAI' || symbol === 'PT-cUSDC')

  if (!isMainnetDaiOrUsdc) {
    return null
  }

  return (
    <p className='text-center mt-2 mb-6 text-xxs xs:text-sm'>
      {t('wantAHigherChanceToWin', 'Want a higher chance to win?')} 🐳{' '}
      <a href='https://pods.pooltogether.com'>{t('joinThePod', 'Join the Pod')}</a>
    </p>
  )
}
