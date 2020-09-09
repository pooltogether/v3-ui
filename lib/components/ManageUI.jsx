import React, { useContext, useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { ethers } from 'ethers'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
// import { FetchExtendedChainData } from 'lib/components/FetchExtendedChainData'
import { Button } from 'lib/components/Button'
import { CardGrid } from 'lib/components/CardGrid'
import { LoadingSpinner } from 'lib/components/LoadingSpinner'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { Meta } from 'lib/components/Meta'
import { SponsorshipPane } from 'lib/components/SponsorshipPane'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PoolActionsUI } from 'lib/components/PoolActionsUI'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { Tagline } from 'lib/components/Tagline'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { isEmptyObject } from 'lib/utils/isEmptyObject'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

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

  const decimals = pool?.underlyingCollateralDecimals
  const tickerUpcased = pool?.underlyingCollateralSymbol?.toUpperCase()

  const isRngCompleted = pool?.isRngCompleted
  const isRngRequested = pool?.isRngRequested
  const canStartAward = pool?.canStartAward
  const canCompleteAward = pool?.canCompleteAward

  const poolLocked = canCompleteAward || (isRngRequested && !canCompleteAward)
  const openPhase = !canStartAward && !canCompleteAward && !isRngRequested

  const exitFeeMantissa = pool?.exitFeeMantissa ?? '0'
  const creditRateMantissa = pool?.creditRateMantissa ?? '0'

  return <>
    <Meta
      title={`${pool?.name} - Manage - Pools`}
    />

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
      className='bg-highlight-3 rounded-lg px-10 pt-10 pb-10 text-white mt-4 sm:mt-16 flex flex-col justify-center'
    >
      <h4>
        Pool status: <span className='text-green'>
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
          <span
            className='w-6 flex items-start justify-start mt-6'
          >
            <LoadingSpinner />
          </span>
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
        className='mt-4'
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

    <SponsorshipPane
      decimals={decimals}
      tickerUpcased={tickerUpcased}
      usersAddress={usersAddress}
    />

    {/* <FetchExtendedChainData>
      {({ extendedChainData }) => {
        console.log({ extendedChainData})
        return <pre>{JSON.stringify(extendedChainData, null, 2)}</pre>
      }}
    </FetchExtendedChainData> */}

    {pool && !isEmptyObject(pool) && <>
      <CardGrid
        cardGroupId='manage-pool-cards'
        cards={[
          {
            icon: null,
            title: 'Exit Fee Mantissa',
            content: <>
              <h3>
                {displayAmountInEther(
                  ethers.utils.bigNumberify(exitFeeMantissa).mul(100).toString(),
                  { precision: 6 }
                )} %
              </h3>
            </>
          },
          {
            icon: null,
            title: 'Credit Rate Mantissa',
            content: <>
              <h3>
                {displayAmountInEther(
                  ethers.utils.bigNumberify(creditRateMantissa).mul(100).toString(),
                  { precision: 6 }
                )} %
              </h3>
            </>
          },
          {
            icon: null,
            title: 'Prize Period (in seconds)',
            content: <h3>{numberWithCommas(
              pool.prizePeriodSeconds,
              { precision: 0 }
            )}</h3>
          },
          {
            icon: null,
            title: 'Sponsorship',
            content: <h3>{displayAmountInEther(
              pool.totalSponsorship,
              { decimals, precision: 4 }
            )} {tickerUpcased}</h3>
          },
        ]}
      />

      {/* <br />
      <br /> */}

      {/* {pool && <pre>{JSON.stringify(pool, null, 2)}</pre>} */}
    </>}

    <Tagline />
  </>
}
