import React, { useContext, useState, useEffect } from 'react'
import classnames from 'classnames'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'

export const DepositTxButton = (props) => {
  const { needsApproval, disabled, nextStep } = props

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  const ticker = pool?.underlyingCollateralSymbol
  const tickerUpcased = ticker?.toUpperCase()

  const handleDepositClick = (e) => {
    e.preventDefault()
    nextStep()
  }

  return <Button
    wide
    size='lg'
    onClick={handleDepositClick}
    disabled={disabled}
    className={classnames({
      'w-49-percent': needsApproval,
      'mx-auto w-full': !needsApproval
    })}
  >
    Deposit
  </Button>
}
