import React, { useContext } from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { Meta } from 'lib/components/Meta'
import { NonInteractableCard } from 'lib/components/NonInteractableCard'
import { Odds } from 'lib/components/Odds'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Tagline } from 'lib/components/Tagline'
import { TimelockedBalanceUI } from 'lib/components/TimelockedBalanceUI'
import { WithdrawButton } from 'lib/components/WithdrawButton'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

import TicketIcon from 'assets/images/tickets-icon.svg'

export const AccountPoolShowUI = (props) => {
  const [t] = useTranslation()

  const poolData = useContext(PoolDataContext)
  const { pool, dynamicPlayerData } = poolData

  const poolIsLocked = pool?.isRngRequested

  const poolAddress = pool?.poolAddress
  const symbol = pool?.symbol
  const decimals = pool?.underlyingCollateralDecimals

  const ticker = pool?.underlyingCollateralSymbol

  let playerData
  if (dynamicPlayerData) {
    playerData = dynamicPlayerData.find(data => data.prizePool.id === poolAddress)
  }

  let usersBalance = 0
  if (pool && playerData && decimals) {
    usersBalance = Number(ethers.utils.formatUnits(
      playerData.balance,
      Number(decimals)
    ))
  }

  const getMoreTicketsButton = <ButtonLink
    textSize='xl'
    href='/pools/[symbol]/deposit'
    as={`/pools/${symbol}/deposit`}
  >
    {t('getMoreTickets')}
  </ButtonLink>

  return <>
    <Meta
      title={`${pool?.name} - My account`}
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
            className='mx-auto'
          />

          <div
            className='mb-4 font-bold'
          >
            You currently have no tickets in this pool.
            <br />Deposit now to get tickets!
          </div>

          {getMoreTicketsButton}
        </BlankStateMessage>
      </> : <>
      <NonInteractableCard
        className='ticket-card'
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
                Prize ${displayAmountInEther(
                  pool?.estimatePrize,
                  { decimals, precision: 0 }
                )}
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
                  {pool?.frequency}
                </span>
              </div>
            </div>
          </div>

          <div
            className='flex flex-col items-end w-4/12 sm:w-9/12 lg:w-9/12'
          >
            <TimelockedBalanceUI
              pool={pool}
              playerData={playerData}
            />
          </div>



        </div>

        <div
          className='mt-5 flex items-center justify-between pt-2'
        >
          <div
            className='w-full xs:w-4/12 sm:w-4/12 lg:w-4/12 sm:border-r border-accent-4'
          >
            <Odds
              fontSansRegular
              className='font-bold text-flashy text-xl sm:text-2xl lg:text-3xl'
              pool={pool}
              usersBalance={usersBalance}
            />
            <span
              className='block text-caption uppercase font-bold'
            >
              Winning odds
            </span>
          </div>

          <div
            className='w-full xs:w-4/12 sm:w-4/12 lg:w-4/12 sm:pl-16 font-bold text-xl sm:text-2xl lg:text-3xl text-inverse'
          >
            <PoolCountUp
              fontSansRegular
              end={usersBalance}
              decimals={null}
            /> Tickets
            <span className='block text-caption uppercase'>
              ${usersBalance} {ticker}
            </span>
          </div>



          <div
            className='w-4/12 text-right'
            style={{
              lineHeight: 1.2,
            }}
          >
            <WithdrawButton
              poolIsLocked={poolIsLocked}
              poolSymbol={symbol}
            />
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
