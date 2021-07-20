import React from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { TokenIcon } from '@pooltogether/react-components'
import { displayPercentage } from '@pooltogether/utilities'

import { useWMaticApr } from 'lib/hooks/useWMaticApr'

export const AprChip = (props) => {
  const { chainId, tokenFaucetDripToken, tokenListener, ticket, prizePool, className } = props

  const { t } = useTranslation()

  const dripTokenAddress = tokenFaucetDripToken?.address
  const dripTokenSymbol = tokenFaucetDripToken?.symbol

  let apr = tokenListener?.apr
  if (prizePool.address === '0x887e17d791dcb44bfdda3023d26f7a04ca9c7ef4') {
    apr = useWMaticApr(tokenListener.dripRatePerSecond, ticket.totalSupply)
  }

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
