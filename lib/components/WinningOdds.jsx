import React from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { stringWithPrecision } from '@pooltogether/utilities'

export const WinningOdds = (props) => {
  const { odds, className } = props
  const { t } = useTranslation()

  return (
    <span className={classnames('text-accent-1', className)}>
      {t('winningOdds')}:
      {!odds || Number(odds) < 1 ? (
        <span className='ml-1 font-bold text-accent-3'>{t('notAvailableAbbreviation')}</span>
      ) : (
        <span className='ml-1 font-bold text-flashy'>
          1 in {stringWithPrecision(odds.toString(), { precision: 2 })}
        </span>
      )}
    </span>
  )
}
