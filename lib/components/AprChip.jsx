import React from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { TokenIcon } from '@pooltogether/react-components'
import { displayPercentage } from '@pooltogether/utilities'

import { useTokenFaucetApr } from 'lib/hooks/useTokenFaucetApr'

export const AprChip = (props) => {
  const { t } = useTranslation()

  const { tokenFaucet, chainId, className } = props

  const dripTokenAddress = tokenFaucet.dripToken.address
  const dripTokenSymbol = tokenFaucet.dripToken.symbol

  const apr = useTokenFaucetApr(tokenFaucet)

  if (!apr) {
    return null
  }

  return (
    <div className={classnames('text-xxxs text-accent-1 flex items-center', className)}>
      <TokenIcon
        chainId={chainId}
        address={dripTokenAddress}
        className='mr-2'
        sizeClasses='w-4 h-4'
      />
      {t('earnNumPercentApr', { ticker: dripTokenSymbol, percentApr: displayPercentage(apr) })}
    </div>
  )
}
