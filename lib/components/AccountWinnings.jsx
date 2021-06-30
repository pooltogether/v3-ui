import React from 'react'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { ethers } from 'ethers'
import { isEmpty } from 'lodash'
import { useUsersAddress } from '@pooltogether/hooks'

import { useTranslation } from 'react-i18next'
import { isSelfAtom } from 'lib/components/AccountUI'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import IconTarget from 'assets/images/icon-target@2x.png'
import { useAllUsersPrizes } from 'lib/hooks/useAllUsersPrizes'

export const AccountWinnings = () => {
  const { t } = useTranslation()

  const [isSelf] = useAtom(isSelfAtom)

  const usersAddress = useUsersAddress()

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  const { data: prizesWon, isFetched } = useAllUsersPrizes(address)

  if (!isFetched) return null

  const awarded = {}
  prizesWon.forEach((prize) => {
    if (!prize) {
      return
    }

    prize.awardedControlledTokens.forEach((awardedControlledToken) => {
      const prizeId = awardedControlledToken.prize.id
      const token = awardedControlledToken.token
      const underlyingTokenAddress =
        awardedControlledToken.prize.prizePool.underlyingCollateralToken
      const amount = awardedControlledToken.amount
      awarded[prizeId] = {
        total: ethers.utils.formatUnits(amount, token.decimals),
        ticker: token.symbol,
        decimals: token.decimals,
        address: underlyingTokenAddress
      }
    })
  })

  const awardKeys = !isEmpty(awarded) ? Object.keys(awarded) : []

  return (
    <>
      <div className='text-accent-2 mt-16 mb-4 opacity-90 font-headline uppercase xs:text-sm'>
        {t(isSelf ? 'myWinnings' : 'winnings')}
      </div>

      <div className='xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-2 sm:px-6 py-3'>
        <div className='flex justify-between xs:py-4 pb-0 px-2 xs:px-4'>
          <div className='w-1/2'>
            {/* TODO: Bring back the USD value of all winnings, when they won them and with all external tokens and lootbox tokens */}
            {/* <h6 className='flex items-center font-normal'>{t('allTimeWinnings')}</h6> */}
            {/* <h3> */}
            {/* $<PoolNumber>{displayAmountInEther(total, { precision: 2 })}</PoolNumber> */}
            {/* </h3> */}
            {awardKeys.length === 0 ? (
              <div className='mb-10 font-bold'>
                {t('youHaveNotWonYet')}
                <br />
                {t('keepYourDepositsInThePoolsToWin')}
              </div>
            ) : (
              <table className='table-fixed text-xxs xs:text-base sm:text-xl w-full'>
                <tbody>
                  {awardKeys.map((awardKey) => {
                    const award = awarded[awardKey]

                    return (
                      <tr key={`award-winnings-row-${awardKey}`}>
                        <td className='px-2 sm:px-3 text-left font-bold'>
                          <span className='mr-2'>
                            <PoolCurrencyIcon sm address={award.address} />
                          </span>
                          {numberWithCommas(award.total, { decimals: award.decimals })}{' '}
                          {award.ticker}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className='ml-auto'>
            <img src={IconTarget} className='w-24 h-24 mx-auto' />
          </div>
        </div>
      </div>
    </>
  )
}
