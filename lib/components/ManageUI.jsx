import React, { useContext, useState } from 'react'
import FeatherIcon from 'feather-icons-react'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { CardGrid } from 'lib/components/CardGrid'
import { PoolActionsUI } from 'lib/components/PoolActionsUI'
import { IndexUILoader } from 'lib/components/loaders/IndexUILoader'
import { Tagline } from 'lib/components/Tagline'
import { LoadingSpinner } from 'lib/components/LoadingSpinner'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { Meta } from 'lib/components/Meta'
import { SponsorshipPane } from 'lib/components/SponsorshipPane'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { useCurrentPool, useAllPools } from 'lib/hooks/usePools'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const ManageUI = (props) => {
  const { t } = useTranslation()

  const { usersAddress } = useContext(AuthControllerContext)
  const { isFetched } = useAllPools()

  const { contractAddresses } = useContractAddresses()
  const { data: pool } = useCurrentPool()

  if (!pool || !isFetched) {
    return (
      <>
        <PageTitleAndBreadcrumbs
          title={`Pool Management`}
          breadcrumbs={[
            {
              href: '/',
              as: '/',
              name: t('pools')
            },
            {
              name: '...'
            },
            {
              name: t('manage')
            }
          ]}
        />
        <div className='mb-16'></div>
        <IndexUILoader />
      </>
    )
  }

  const underlyingToken = pool.tokens.underlyingToken
  const decimals = underlyingToken.decimals
  const tickerUpcased = underlyingToken.symbol

  const prize = pool.prize
  const isRngRequested = prize.isRngRequested
  const canStartAward = prize.canStartAward
  const canCompleteAward = prize.canCompleteAward

  const poolLocked = canCompleteAward || (isRngRequested && !canCompleteAward)
  const openPhase = !canStartAward && !canCompleteAward && !isRngRequested

  return (
    <>
      <Meta title={`${t('manage')} - ${pool.name}`} />

      <PageTitleAndBreadcrumbs
        title={`Pool Management`}
        pool={pool}
        breadcrumbs={[
          {
            href: '/',
            as: '/',
            name: t('pools')
          },
          {
            href: '/pools/[symbol]',
            as: `/pools/${pool.symbol}`,
            name: pool.name
          },
          {
            name: t('manage')
          }
        ]}
      />

      <div className='bg-highlight-3 rounded-lg px-4 pt-4 pb-5 xs:p-10 text-white mt-4 sm:mt-16 flex flex-col justify-center'>
        <h4>
          {t('poolStatus')}{' '}
          <span className='text-green'>
            {poolLocked && (
              <>
                {t('poolLocked')}{' '}
                <FeatherIcon
                  strokeWidth='0.09rem'
                  icon='lock'
                  className='inline-block w-6 h-6 relative'
                  style={{
                    top: -3
                  }}
                />
              </>
            )}
            {canStartAward && (
              <>
                {t('readyToBeAwarded')}{' '}
                <FeatherIcon
                  strokeWidth='0.09rem'
                  icon='check'
                  className='inline-block w-6 h-6 relative'
                  style={{
                    top: -3
                  }}
                />
              </>
            )}
            {openPhase && (
              <>
                {t('open')}{' '}
                <FeatherIcon
                  strokeWidth='0.09rem'
                  icon='clock'
                  className='inline-block w-6 h-6 relative'
                  style={{
                    top: -3
                  }}
                />
              </>
            )}
          </span>
        </h4>

        <p className='text-caption font-bold'>
          {isRngRequested && !canCompleteAward && (
            <>
              {t('waitingOnRandomNumberGeneration')}
              <span className='w-6 flex items-start justify-start mt-6'>
                <LoadingSpinner />
              </span>
            </>
          )}

          {canStartAward && (
            <>
              {t('prizeRewardProcessReady')}
              {/* Prize reward process ready to be started! */}
            </>
          )}

          {canCompleteAward && (
            <>
              {t('prizeRewardProcessReadyToFinish')}
              {/* Prize reward process ready to be finished! */}
            </>
          )}

          {openPhase && (
            <>
              {t('poolAcceptingDepositsAndWithdrawals')}
              {/* Pool is accepting deposits and withdrawals. */}
            </>
          )}
        </p>

        <div className='mt-4'>
          {openPhase ? (
            <>
              <h6 className='mb-2'>{t('prizePeriodRemaining')}</h6>
              <NewPrizeCountdown pool={pool} flashy={false} />
            </>
          ) : (
            <PoolActionsUI contractAddresses={contractAddresses} usersAddress={usersAddress} />
          )}
        </div>
      </div>

      <SponsorshipPane
        pool={pool}
        decimals={decimals}
        tickerUpcased={tickerUpcased}
        usersAddress={usersAddress}
      />

      <CardGrid
        cardGroupId='manage-pool-cards'
        cards={[
          {
            icon: null,
            title: t('prizePeriodInSeconds'),
            content: <h3>{numberWithCommas(pool.config.prizePeriodSeconds)}</h3>
          },
          {
            icon: null,
            title: t('sponsorship'),
            content: (
              <h3>
                {numberWithCommas(pool.tokens.sponsorship.totalSupply)} {tickerUpcased}
              </h3>
            )
          }
        ]}
      />

      <Tagline />
    </>
  )
}
