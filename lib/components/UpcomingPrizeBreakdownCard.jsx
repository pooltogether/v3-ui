import React from 'react'
import classnames from 'classnames'

import { useTranslation } from 'lib/../i18n'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'
import { usePool } from 'lib/hooks/usePool'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import PrizeIllustration from 'assets/images/prize-illustration-new@2x.png'
import LootBoxIllustration from 'assets/images/lootbox-closed-halo@2x.png'
import { PoolNumber } from 'lib/components/PoolNumber'

export const UpcomingPrizeBreakdownCard = (props) => {
  const { t } = useTranslation()

  const { pool } = usePool()

  const { computedLootBoxAddress } = pool.lootBox

  const symbol = pool?.underlyingCollateralSymbol?.toUpperCase()

  const numberOfWinnersMinusOne = pool?.numberOfWinners
    ? parseInt(pool?.numberOfWinners, 10) - 1
    : 0

  const ticketPrizePerWinnerFormatted =
    (pool?.ticketPrizePerWinnerUSD &&
      `${numberWithCommas(pool?.ticketPrizePerWinnerUSD, { precision: 2 })}`) ||
    '0'

  const hasTicketPrize = Boolean(parseFloat(pool?.ticketPrizeUSD))

  let strategyDescriptionBasic
  if (Boolean(pool?.splitExternalErc20Awards)) {
    strategyDescriptionBasic = t('prizeSplitEvenlyBetweenAllWinners', {
      numberOfWinners: pool?.numberOfWinners
    })
  } else if (hasTicketPrize) {
    strategyDescriptionBasic = t('prizeInterestSplitBetweenNWinners', {
      numberOfWinnersMinusOne
    })
  }

  if (pool?.numberOfWinners <= 1) {
    strategyDescriptionBasic = t('prizeGivenToASingleWinner')
  }

  return (
    <Card>
      <h3 className='text-center'>
        {symbol} {t('prize')} #{pool?.currentPrizeId}
      </h3>

      <p className='mx-auto text-accent-1 text-center'>{strategyDescriptionBasic}</p>

      <div className='flex flex-col xs:flex-row'>
        {computedLootBoxAddress && <div className='hidden sm:block sm:w-2/12'>&nbsp;</div>}

        {hasTicketPrize && (
          <div
            className={classnames(
              'flex flex-col items-center justify-center text-center w-full h-56 xs:h-64',
              {
                'xs:w-5/12': computedLootBoxAddress
              }
            )}
          >
            <img src={PrizeIllustration} className='w-40 mx-auto' />
            <div>
              <h3>{`$${numberWithCommas(pool?.ticketPrizeUSD)}`}</h3>
              <span className='text-sm xs:text-base sm:text-xl text-accent-1 leading-none'>
                {t('tickets')}
              </span>
            </div>
          </div>
        )}

        {computedLootBoxAddress && (
          <>
            <div className='w-full xs:w-2/12 text-center -mt-2 xs:mt-24 mb-2 xs:mb-0 xs:pt-3 text-5xl font-bold leading-none'>
              +
            </div>

            <div className='flex flex-col items-center justify-center text-center w-full xs:w-5/12 h-56 xs:h-64'>
              <img src={LootBoxIllustration} className='w-40 mx-auto -mt-8' />
              <div
                className='relative'
                style={{
                  top: 3
                }}
              >
                <h3>
                  {Boolean(pool?.externalAwardsUSD > 0) &&
                    `$${numberWithCommas(pool.externalAwardsUSD)}`}
                </h3>
                <span className='text-sm xs:text-base sm:text-xl text-accent-1 leading-none'>
                  {t('lootBox')}
                </span>
              </div>
            </div>

            <div className='hidden sm:block sm:w-2/12'>&nbsp;</div>
          </>
        )}
      </div>

      {hasTicketPrize && (
        <CardDetails>
          <li className='flex justify-between xs:mx-4 mb-2'>
            <span className='text-accent-1'>
              {computedLootBoxAddress ? t('grandPrize') : t('winner')}
            </span>
            <span className='flex flex-col xs:flex-row text-center xs:text-left'>
              <span>
                $<PoolNumber>{ticketPrizePerWinnerFormatted}</PoolNumber>
              </span>
              {!pool?.splitExternalErc20Awards && Boolean(pool?.externalAwardsUSD) && (
                <span>
                  {ticketPrizePerWinnerFormatted && pool?.externalAwardsUSD && ` + `}
                  {pool?.externalAwardsUSD && (
                    <span>
                      $
                      <PoolNumber>
                        {numberWithCommas(pool.externalAwardsUSD, { precision: 2 })}
                      </PoolNumber>
                    </span>
                  )}
                  <span className='text-accent-1'>{t('lootBox')}</span>
                </span>
              )}
            </span>
          </li>

          {[...Array(numberOfWinnersMinusOne).keys()].map((index) => (
            <li
              key={`runner-up-row-${index}`}
              className='flex justify-between mb-2 last:mb-0 xs:mx-4'
            >
              <span className='text-accent-1'>
                {computedLootBoxAddress ? t('runnerUp') : t('winner')}
              </span>
              <span>
                $<PoolNumber>{ticketPrizePerWinnerFormatted}</PoolNumber>
              </span>
            </li>
          ))}
        </CardDetails>
      )}
    </Card>
  )
}

const Card = (props) => (
  <div className='non-interactable-card my-10 py-4 xs:py-6 px-4 xs:px-6 sm:px-10 bg-card rounded-lg card-min-height-desktop'>
    {props.children}
  </div>
)

const CardDetails = (props) => (
  <ul className='xs:bg-primary theme-light--no-gutter text-inverse rounded-lg p-0 xs:px-4 xs:py-8 mt-4 flex flex-col text-xs xs:text-base sm:text-lg'>
    {props.children}
  </ul>
)
