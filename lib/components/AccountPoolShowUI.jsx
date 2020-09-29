import React, { useContext } from 'react'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import {
  WIZARD_REFERRER_HREF,
  WIZARD_REFERRER_AS_PATH
} from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { Button } from 'lib/components/Button'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { Meta } from 'lib/components/Meta'
import { NonInteractableCard } from 'lib/components/NonInteractableCard'
import { Odds } from 'lib/components/Odds'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Tagline } from 'lib/components/Tagline'
import { TimelockedBalanceUI } from 'lib/components/TimelockedBalanceUI'
import { WithdrawButton } from 'lib/components/WithdrawButton'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import TicketIcon from 'assets/images/PT-Depositing-2-simplified.svg'

export const AccountPoolShowUI = (props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const { pool, dynamicPlayerData } = useContext(PoolDataContext)

  const poolIsLocked = pool?.isRngRequested

  const poolAddress = pool?.poolAddress
  const symbol = pool?.symbol
  const decimals = pool?.underlyingCollateralDecimals
  const ticker = pool?.underlyingCollateralSymbol

  let playerData
  if (dynamicPlayerData) {
    playerData = dynamicPlayerData.find(data => data.prizePool.id === poolAddress)
  }

  let usersTicketBalance = 0
  if (pool && playerData && decimals) {
    usersTicketBalance = Number(ethers.utils.formatUnits(
      playerData.balance,
      Number(decimals)
    ))
  }

  const handleGetTicketsClick = (e) => {
    e.preventDefault()

    Cookies.set(WIZARD_REFERRER_HREF, '/account/pools/[symbol]')
    Cookies.set(WIZARD_REFERRER_AS_PATH, `/account/pools/${pool?.symbol}`)

    router.push(
      `/pools/[symbol]/deposit`,
      `/pools/${pool?.symbol}/deposit`,
      {
        shallow: true
      }
    )
  }

  const getMoreTicketsButton = <Button
    onClick={handleGetTicketsClick}
  >
    {t('getMoreTickets')}
  </Button>


  return <>
    <Meta
      title={`${pool?.name} - ${t('myAccount')}`}
    />

    <PageTitleAndBreadcrumbs
      title={`${t('account')} - ${pool?.name || ''}`}
      breadcrumbs={[
        {
          href: '/account',
          as: '/account',
          name: t('account'),
        },
        {
          href: '/account',
          as: '/account',
          name: t('myAccount')
        },
        {
          name: pool?.name
        }
      ]}
    />

    {!dynamicPlayerData ? <>
      <IndexUILoader />
    </> :
      !playerData ? <>
        <div
          className='mt-4 text-center'
        >
          <PoolCurrencyIcon
            xl
            pool={pool}
          />
          <h3
            className='mt-2 mb-8 font-bold'
          >
            {pool?.name}
          </h3>
        </div>

        <BlankStateMessage>
          <img
            src={TicketIcon}
            className='mx-auto w-16 mb-8'
          />

          <div
            className='mb-4 font-bold'
          >
            {t('youCurrentlyHaveNoTicketsInThisPool')}
            <br />{t('depositNowToGetTickets')}
          </div>

          {getMoreTicketsButton}
        </BlankStateMessage>
      </> : <>

        <TimelockedBalanceUI
          pool={pool}
          playerData={playerData}
        />

        <NonInteractableCard
          className='ticket-card my-8 sm:mt-20 sm:mb-12'
        >
          <div className='flex items-center pb-2'>
            <div
              className='flex items-center font-bold w-8/12 sm:w-6/12 pb-2'
            >
              <PoolCurrencyIcon
                lg
                pool={pool}
              />

              <div
                className='flex flex-col items-start justify-between w-full ml-1 sm:ml-6 leading-none'
              >
                <div
                  className='inline-block text-left text-xl sm:text-3xl font-bold text-inverse relative'
                  style={{
                    top: -6
                  }}
                >
                  {t('prizeAmount', {
                    amount: numberWithCommas(
                      pool?.estimatePrize,
                      { precision: 2 }
                    )
                  })}
                </div>
                <div
                  className='inline-block text-left text-caption-2 relative'
                  style={{
                    left: 2,
                    bottom: -4
                  }}
                >
                  <span
                    className='uppercase text-caption'
                  >
                    {t(pool?.frequency.toLowerCase())}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className='mt-0 xs:mt-5 flex flex-col xs:flex-row items-center justify-between pt-2'
          >
            <div
              className='w-full pb-10 xs:pb-0 xs:w-4/12 sm:w-4/12 lg:w-4/12 sm:border-r border-accent-4'
            >
              {usersTicketBalance < 1 ? <>
                <span
                  className='font-bold text-xl sm:text-2xl lg:text-3xl text-accent-3'
                >
                  {t('notAvailableAbbreviation')}
                </span>
              </> : <>
                <Odds
                  fontSansRegular
                  className='font-bold text-flashy text-xl sm:text-2xl lg:text-3xl'
                  pool={pool}
                  usersBalance={usersTicketBalance}
                />
              </>}
              
              <span
                className='block text-caption uppercase font-bold'
              >
                {t('winningOdds')}
              </span>
            </div>

            <div
              className='w-full mt-2 xs:mt-0 xs:w-4/12 sm:w-4/12 lg:w-4/12 sm:pl-16 font-bold text-xl sm:text-2xl lg:text-3xl text-inverse'
            >
              <PoolCountUp
                fontSansRegular
                end={Number.parseFloat(usersTicketBalance).toFixed(0)}
                decimals={null}
              /> {t('tickets')}
              <span className='block text-caption uppercase'>
                ${numberWithCommas(usersTicketBalance, { precision: 4 })} {ticker}
              </span>
            </div>

            <div
              className='mt-4 xs:mt-0 w-4/12 text-center sm:text-right'
              style={{
                lineHeight: 1.2,
              }}
            >
              {usersTicketBalance > 0 && <>
                <WithdrawButton
                  poolIsLocked={poolIsLocked}
                  poolSymbol={symbol}
                />
              </>}
            </div>
          </div>
        </NonInteractableCard>

      <div
        className='flex items-center justify-center mt-12'
      >
        {getMoreTicketsButton}
      </div>
    </>}

    <Tagline />
  </>
}
