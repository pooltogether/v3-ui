import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'

export function DepositPaneTitle(props) {
  const { ticker, pool } = props

  const { t } = useTranslation()

  return (
    <PaneTitle>
      <div className='font-bold inline-block sm:block relative mb-2' style={{ top: -2 }}>
        <PoolCurrencyIcon
          lg
          symbol={pool.tokens.underlyingToken.symbol}
          address={pool.tokens.underlyingToken.address}
        />
      </div>{' '}
      {t('depositTickerToWin', {
        ticker
      })}
    </PaneTitle>
  )
}
