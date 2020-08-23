import React, { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { LoadingSpinner } from 'lib/components/LoadingSpinner'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PoolActionsUI } from 'lib/components/PoolActionsUI'
import { IndexUILoader } from 'lib/components/IndexUILoader'

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

    <h4
      className='flex flex-col w-full py-4 sm:py-2 mt-16'
    >
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
        Pool is in open phase, accepting deposits and withdrawals.
      </>}
    </h4>

    <div
      className='mb-10'
    >
      <PoolActionsUI
        poolAddresses={poolAddresses}
        usersAddress={usersAddress}
      />
    </div>
  </>
}
