import React, { useContext } from 'react'
import FeatherIcon from 'feather-icons-react'

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

  const poolLocked = canCompleteAward || (isRngRequested && !canCompleteAward)
  const openPhase = !canStartAward && !canCompleteAward && !isRngRequested

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
      className='bg-highlight-3 rounded-lg px-6 pt-10 pb-10 text-white mt-4 sm:mt-16 flex flex-col justify-center'
    >
      <h4>
        Pool status: <span className='text-accent-3'>
          {poolLocked && <>
            Pool locked <FeatherIcon
              strokeWidth='0.09rem'
              icon='lock'
              className='inline-block w-6 h-6 relative'
              style={{
                top: -3
              }}
            />
          </>}
          {canStartAward && <>
            Ready to be awarded <FeatherIcon
              strokeWidth='0.09rem'
              icon='check'
              className='inline-block w-6 h-6 relative'
              style={{
                top: -3
              }}
            />
          </>}
          {openPhase && <>
            Open <FeatherIcon
              strokeWidth='0.09rem'
              icon='clock'
              className='inline-block w-6 h-6 relative'
              style={{
                top: -3
              }}
            />
          </>}
        </span>
      </h4>

      <p className='text-caption font-bold'>
        {isRngRequested && !canCompleteAward && <>
          Waiting on random number generation ...
          <LoadingSpinner />
        </>}

        {canStartAward && <>
          Prize reward process ready to be started!
        </>}

        {canCompleteAward && <>
          Prize reward process ready to be finished!
        </>}

        {openPhase && <>
          Pool is accepting deposits and withdrawals.
        </>}
      </p>

      <div
        className='mt-10'
      >
        {openPhase ? <>
          <h6
            className='mb-2'
          >
            Prize period remaining:
          </h6>
          <NewPrizeCountdown
            pool={pool}
            flashy={false}
          />
        </> : <>
          <PoolActionsUI
            poolAddresses={poolAddresses}
            usersAddress={usersAddress}
          />
        </>}
      </div>
    </div>

    <Tagline />
  </>
}
