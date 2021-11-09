import React from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { TokenIcon } from '@pooltogether/react-components'
import { displayPercentage } from '@pooltogether/utilities'

export const AprChip = (props) => {
  const { t } = useTranslation()

  const { chainId, className, tokenAddress, tokenSymbol, apr } = props

  if (!apr) {
    return null
  }

  return (
    <div className={classnames('text-xxxs text-accent-1 flex items-center', className)}>
      <TokenIcon chainId={chainId} address={tokenAddress} className='mr-2' sizeClasses='w-3 h-3' />
      {t('earnNumPercentApr', { ticker: tokenSymbol, percentApr: displayPercentage(apr) })}
    </div>
  )
}
