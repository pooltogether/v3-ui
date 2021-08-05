import React from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { stringWithPrecision } from '@pooltogether/utilities'
import { ThemedClipSpinner } from '@pooltogether/react-components'

export const WinningOdds = (props) => {
  const { odds, className, isLoading } = props
  const { t } = useTranslation()

  return (
    <span className={classnames('text-accent-1', className)}>
      <span className='mr-1'>{t('winningOdds')}:</span>
      <Odds odds={odds} isLoading={isLoading} />
    </span>
  )
}

const Odds = (props) => {
  const { isLoading, odds } = props
  const { t } = useTranslation()

  if (isLoading) {
    return <ThemedClipSpinner className='mr-auto' />
  } else if (!odds || Number(odds) < 1) {
    return <span className='font-bold text-accent-3 mr-auto'>{t('notAvailableAbbreviation')}</span>
  }

  return (
    <span className='font-bold text-flashy mr-auto'>
      {t('oneInOdds', { odds: stringWithPrecision(odds.toString(), { precision: 2 }) })}
    </span>
  )
}
