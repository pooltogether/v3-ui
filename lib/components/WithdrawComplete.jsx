import React, { useContext } from 'react'
import { useRouter } from 'next/router'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ButtonLink } from 'lib/components/ButtonLink'
import { PaneTitle } from 'lib/components/PaneTitle'
import { formatFutureDateInSeconds } from 'lib/utils/formatFutureDateInSeconds'

export const WithdrawComplete = (props) => {
  const router = useRouter()

  const quantity = router.query.quantity
  const withdrawType = router.query.withdrawType
  const timelockDuration = router.query.timelockDuration
  const fee = router.query.fee
  const net = router.query.net

  const scheduledWithdrawal = withdrawType && withdrawType === 'scheduled'
  const instantNoFee = withdrawType === 'instantNoFee'

  let formattedFutureDate
  if (timelockDuration) {
    formattedFutureDate = formatFutureDateInSeconds(
      Number(timelockDuration)
    )
  }

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  const underlyingCollateralSymbol = pool && pool.underlyingCollateralSymbol
  const symbolUpcased = underlyingCollateralSymbol && underlyingCollateralSymbol.toUpperCase()

  if (!withdrawType) {
    return null
  }

  const handleShowAccount = (e) => {
    e.preventDefault()

    router.push('/account', '/account', { shallow: true })
  }

  // TODO: show what happened here!
  // 3. your new odds are:

  return <>
    <PaneTitle small>
      Successfully {scheduledWithdrawal ?
        'scheduled your withdrawal' :
        'withdrew'
      }
    </PaneTitle>

    <PaneTitle>
      {scheduledWithdrawal || instantNoFee ? <>
        ${quantity} {symbolUpcased} = {quantity} tickets
      </> : <>
        You received ${net} {symbolUpcased}
      </>}
    </PaneTitle>

    {!instantNoFee && <>
      <div className='-mt-6 mb-10'>
        <PaneTitle small>
          {scheduledWithdrawal ? <>
            your funds will be ready in: {formattedFutureDate}
          </> : <>
            ... and forfeited a fairness fee of ${fee} {symbolUpcased} to the pool
          </>}
        </PaneTitle>
      </div>
    </>}

    <div>
      <ButtonLink
        href='/account'
        as='/account'
        textSize='2xl'
      >
        View your account
      </ButtonLink>
    </div>
  </>
}
