import React from 'react'
import classnames from 'classnames'

import { useTranslation } from 'lib/../i18n'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'
import { usePool } from 'lib/hooks/usePool'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import PrizeIllustration from 'assets/images/prize-illustration-new@2x.png'
import LootBoxIllustration from 'assets/images/lootbox-closed-halo@2x.png'

export const UpcomingPrizeBreakdownCard = (props) => {
  const { t } = useTranslation()

  const { pool } = usePool()

  const { computedLootBoxAddress } = pool.lootBox

  const symbol = pool?.underlyingCollateralSymbol?.toUpperCase()

  const numberOfWinnersMinusOne = pool?.numberOfWinners
    ? parseInt(pool?.numberOfWinners, 10) - 1
    : 0

  const ticketPrizePerWinnerFormatted =
    pool?.ticketPrizePerWinnerUSD &&
    `$${numberWithCommas(pool?.ticketPrizePerWinnerUSD, { precision: 2 })}`

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
    <>
      <div className='non-interactable-card my-6 py-4 xs:py-6 px-4 xs:px-6 sm:px-10 bg-card rounded-lg'>
        <h3>
          {symbol} {t('prize')} #{pool?.currentPrizeId}
        </h3>

        <p className='sm:w-2/3 text-accent-1'>
          {strategyDescriptionBasic}
          <br />
          {t('willBeAwardedIn')}{' '}
          <span className='text-inverse'>
            <NewPrizeCountdownInWords extraShort pool={pool} />
          </span>
        </p>

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
          <div className='xs:bg-primary mt-1 xs:mt-0 py-2 xs:py-5 rounded-lg'>
            <table className='theme-light--no-gutter mx-4 w-full text-xxxs xs:text-xxs sm:text-sm align-top'>
              <tbody>
                <tr>
                  <td className='w-1/3 lg:w-1/2'>
                    <span className='font-bold'>
                      {computedLootBoxAddress ? t('grandPrize') : t('winner')}
                    </span>
                  </td>
                  <td>
                    <span className='font-bold'>
                      {ticketPrizePerWinnerFormatted && `${ticketPrizePerWinnerFormatted}`}
                    </span>{' '}
                    <span className='text-accent-1'>
                      {' '}
                      {symbol} {t('tickets')}
                    </span>
                    {!pool?.splitExternalErc20Awards && Boolean(pool?.externalAwardsUSD) && (
                      <>
                        <span className='font-bold'>
                          {ticketPrizePerWinnerFormatted && pool?.externalAwardsUSD && ` + `}
                          {pool?.externalAwardsUSD &&
                            `$${numberWithCommas(pool.externalAwardsUSD)}`}
                        </span>{' '}
                        <span className='text-accent-1'>{t('lootBox')}</span>
                      </>
                    )}
                  </td>
                </tr>

                {[...Array(numberOfWinnersMinusOne).keys()].map((index) => (
                  <tr key={`runner-up-row-${index}`}>
                    <td className='w-1/3 lg:w-1/2'>
                      <span className='font-bold'>
                        {computedLootBoxAddress ? t('runnerUp') : t('winner')}
                      </span>
                    </td>
                    <td>
                      <span className='font-bold'>{ticketPrizePerWinnerFormatted}</span>{' '}
                      <span className='text-accent-1'>
                        {symbol} {t('tickets')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
