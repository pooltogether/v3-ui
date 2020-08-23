import React, { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { LoadingSpinner } from 'lib/components/LoadingSpinner'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PoolActionsUI } from 'lib/components/PoolActionsUI'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { Tagline } from 'lib/components/Tagline'

export const ManageUI = (
  props,
) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext
  
  const poolDataContext = useContext(PoolDataContext)
  const {
    loading,
    poolAddresses,
    pool,
  } = poolDataContext

  if (loading) {
    return <IndexUILoader />
  }

  const isRngCompleted = pool?.isRngCompleted
  const isRngRequested = pool?.isRngRequested
  const canStartAward = pool?.canStartAward
  const canCompleteAward = pool?.canCompleteAward
  console.log({ canStartAward, canCompleteAward, isRngCompleted, isRngRequested,})

  return <>
    <PageTitleAndBreadcrumbs
      title={`Pool Management`}
      pool={pool}
      breadcrumbs={[
        {
          href: '/',
          as: '/',
          name: 'Pools',
        },
        {
          href: '/pools/[symbol]',
          as: `/pools/${pool?.symbol}`,
          name: pool?.name,
        },
        {
          name: 'Manage'
        }
      ]}
    />

    <div
      className='bg-highlight-3 rounded-lg px-6 pt-16 pb-12 text-white mt-4 sm:mt-16 flex flex-col justify-center'
    >
      <h4>
        {isRngRequested && !canCompleteAward && <>
          Pool locked! Waiting on random number generation ...
          <LoadingSpinner />
        </>}

        {canStartAward && <>
          Pool reward process ready to be started:
        </>}

        {canCompleteAward && <>
          Pool locked! Pool reward process ready to be finished:
        </>}

        {!canStartAward && !canCompleteAward && !isRngRequested && <>
          Pool is in the open phase, accepting deposits and withdrawals.
        </>}
      </h4>

      <NewPrizeCountdown
        pool={pool}
        flashy={false}
      />

      <PoolActionsUI
        poolAddresses={poolAddresses}
        usersAddress={usersAddress}
      />
    </div>


    <Tagline />
  </>
}
