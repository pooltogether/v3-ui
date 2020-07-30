import React, { useContext } from 'react'
import { useRouter } from 'next/router'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'

export const WithdrawComplete = (props) => {
  const router = useRouter()
  const quantity = router.query.quantity

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  const underlyingCollateralSymbol = pool && pool.underlyingCollateralSymbol
  const symbolUpcased = underlyingCollateralSymbol && underlyingCollateralSymbol.toUpperCase()

  const handleShowAccount = (e) => {
    e.preventDefault()

    router.push('/account', '/account', { shallow: true })
  }

  return <>
    <PaneTitle small>
      Successfully withdrawn
    </PaneTitle>

    <PaneTitle>
      {quantity} {symbolUpcased} = {quantity} tickets
    </PaneTitle>

    <div>
      <Button
        size='lg'
        className='w-64'
        onClick={handleShowAccount}
      >
        View your account
      </Button>
    </div>
  </>
}
