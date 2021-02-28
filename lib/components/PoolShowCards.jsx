import React from 'react'

import { Trans, useTranslation } from 'lib/../i18n'
import { CardGrid } from 'lib/components/CardGrid'
import { TicketsSoldGraph } from 'lib/components/TicketsSoldGraph'
import { LastWinnersListing } from 'lib/components/LastWinnersListing'
import { PoolNumber } from 'lib/components/PoolNumber'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import CompoundFinanceIcon from 'assets/images/icon-compoundfinance.svg'
import PrizeStrategyIcon from 'assets/images/icon-prizestrategy@2x.png'
import TicketsIcon from 'assets/images/icon-ticket@2x.png'
import PlayersIcon from 'assets/images/players@2x.png'
import PrizeSourceIcon from 'assets/images/icon-yieldsource@2x.png'
import PrizeIcon from 'assets/images/icon-prize@2x.png'

export const PoolShowCards = (props) => {
  const { pool } = props
  
  const { t } = useTranslation()
  
  const decimals = pool?.underlyingCollateralDecimals

  const cards = [
    {
      icon: PlayersIcon,
      title: t('players'),
      content: (
        <>
          <h3>{numberWithCommas(pool?.playerCount, { precision: 0 })}</h3>
        </>
      ),
    },
    {
      icon: TicketsIcon,
      title: t('totalTickets'),
      content: (
        <>
          <TicketsSoldGraph pool={pool} />

          <h3 className='mt-2'>
            {displayAmountInEther(pool.ticketSupply, {
              precision: 0,
              decimals,
            })}
          </h3>
        </>
      ),
    },
    {
      icon: TicketsIcon,
      title: t('totalDeposited'),
      content: (
        <>
          <h3 className='mt-2'>
            $<PoolNumber>{numberWithCommas(pool.totalDepositedUSD, { precision: 2 })}</PoolNumber>
          </h3>
        </>
      ),
    },
    {
      icon: PrizeStrategyIcon,
      title: t('prizeStrategy'),
      content: (
        <>
          <h6>{t('multipleWinnersStrategyDescription')}</h6>
        </>
      ),
    },
    {
      icon: PrizeIcon,
      title: t('pastFiveWinners'),
      content: (
        <>
          <LastWinnersListing pool={pool} />
        </>
      ),
    },
  ]

  const yieldSourceCard = {
    icon: PrizeSourceIcon,
    title: t('prizeSource'),
    content: (
      <>
        <h6 className='flex items-center'>
          <img
            src={CompoundFinanceIcon}
            className='inline-block mr-2 w-6 h-6 sm:w-10 sm:h-10'
            alt={`compound finance's logo`}
          />{' '}
          Compound Finance
        </h6>
      </>
    ),
  }
  
  const stakePrizePoolCard = {
    icon: PrizeSourceIcon,
    title: t('prizeSource'),
    content: (
      <>
        <h6 className='flex flex-col'>
          <Trans
            i18nKey='stakePrizePoolDescription'
            defaults='The prize for this pool is provided each prize period by the owner <a>Learn more</a>'
            components={{
              a: <a
                target='_blank'
                className='underline text-highlight-9'
                href='https://medium.com/pooltogether/prize-pool-builder-9f9c95fad860'
              />
            }}
          />
        </h6>
      </>
    ),
  }

  if (pool?.compoundPrizePool) {
    cards.splice(4, 0, yieldSourceCard)
  } else {
    cards.splice(4, 0, stakePrizePoolCard)
  }

  return (
    <CardGrid
      cardGroupId='pool-cards'
      cards={cards}
    />
  )
}
