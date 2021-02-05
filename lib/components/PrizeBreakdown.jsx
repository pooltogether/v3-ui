import React from 'react'
import { orderBy } from 'lodash'

import { useTranslation } from 'lib/../i18n'
import { PrizeWinner } from 'lib/components/PrizeWinner'
import { usePools } from 'lib/hooks/usePools'
import { formatDate } from 'lib/utils/formatDate'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import PrizeIllustration from 'assets/images/prize-illustration-new@2x.png'
import LootBoxIllustration from 'assets/images/lootbox-closed-halo@2x.png'
import GiftIcon from 'assets/images/icon-gift@2x.png'

export const PrizeBreakdown = (props) => {
  const { t } = useTranslation()

  const { prize, prizeNumber, preAwardTimeTravelPool } = props

  const { contractAddresses } = usePools()

  const interestPrizeUSD = preAwardTimeTravelPool?.interestPrizeUSD
  const externalAwardsValueUSD = preAwardTimeTravelPool?.externalAwardsUSD

  const lootBoxWon = prize?.awardedExternalErc721Nfts.find(
    (_awardedNft) => _awardedNft.address === contractAddresses.lootBox
  )
  const grandPrizeWinnersAddress = lootBoxWon?.winner

  const awardedControlledTokens = [...prize?.awardedControlledTokens]
  if (grandPrizeWinnersAddress) {
    const grandPrizeWinner = awardedControlledTokens.find(
      (awardedControlledToken) => awardedControlledToken.winner === grandPrizeWinnersAddress
    )
    const indexToRemove = awardedControlledTokens.indexOf(grandPrizeWinner)
    if (indexToRemove > -1) {
      awardedControlledTokens.splice(indexToRemove, 1)
    }
    awardedControlledTokens.unshift(grandPrizeWinner)
  }

  return (
    <>
      <div className='non-interactable-card mt-6 py-4 sm:py-6 px-4 xs:px-4 sm:px-10 bg-card rounded-lg card-min-height-desktop'>
        <div className='text-caption uppercase'>
          <img src={GiftIcon} className='inline-block mr-2 card-icon' /> {t('prizeAndWinners')}
        </div>

        <h4>
          {t('prize')} #{prizeNumber}
        </h4>

        {prize?.awardedTimestamp && (
          <>
            <div className='-mt-1'>
              <span className='text-accent-1'>{t('awardedOn')}:</span>{' '}
              {formatDate(prize?.awardedTimestamp)}
            </div>
          </>
        )}

        <div className='flex flex-col xs:flex-row'>
          <div className='hidden sm:block sm:w-2/12'>&nbsp;</div>

          <div className='flex flex-col items-center justify-center text-center w-full xs:w-5/12 xs:w-3/12 h-56 xs:h-64'>
            <img src={PrizeIllustration} className='w-40 mx-auto' />
            <div>
              <h3>
                {interestPrizeUSD && `$${numberWithCommas(interestPrizeUSD, { precision: 2 })}`}
              </h3>
              <span className='text-sm xs:text-base sm:text-xl'>{t('tickets')}</span>
            </div>
          </div>

          <div className='w-full xs:w-2/12 text-center -mt-2 xs:mt-24 mb-2 xs:mb-0 xs:pt-3 text-5xl font-bold leading-none'>
            +
          </div>

          <div className='flex flex-col items-center justify-center text-center w-full xs:w-5/12 xs:w-3/12 h-56 xs:h-64'>
            <img src={LootBoxIllustration} className='w-40 mx-auto -mt-8' />
            <div
              className='relative'
              style={{
                top: 3,
              }}
            >
              <h3>${externalAwardsValueUSD ? numberWithCommas(externalAwardsValueUSD) : '0.00'}</h3>
              <span className='text-sm xs:text-base sm:text-xl'>{t('lootBox')}</span>
            </div>
          </div>

          <div className='hidden sm:block sm:w-2/12'>&nbsp;</div>
        </div>

        <div className='mt-1 xs:mt-0 xs:bg-primary px-4 py-2 xs:py-5 rounded-lg'>
          <table className='theme-light--no-gutter w-full text-xxxs xs:text-xxs sm:text-sm align-top'>
            <thead>
              <tr style={{ background: 'none' }}>
                <th>{t('prize')}</th>
                <th>{t('player')}</th>
                <th>{t('odds')}</th>
                <th width='70'>{t('tickets')}</th>
              </tr>
            </thead>
            <tbody>
              {prize?.awardedTimestamp ? (
                <>
                  {awardedControlledTokens?.map((awardedControlledToken, index) => {
                    return (
                      <PrizeWinner
                        key={`prize-winner-row-${awardedControlledToken.id}`}
                        pool={preAwardTimeTravelPool}
                        prize={prize}
                        awardedControlledToken={awardedControlledToken}
                        grandPrizeWinner={index === 0}
                      />
                    )
                  })}
                </>
              ) : (
                <tr>
                  <td
                    colSpan='4'
                    className='text-center'
                    style={{
                      paddingTop: '0.5rem',
                    }}
                  >
                    {t('prizeNotAwardedYet')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
