import React from 'react'
import { ethers } from 'ethers'

import { Trans, useTranslation } from 'lib/../i18n'
import { useUsersV2Balances } from 'lib/hooks/useUsersV2Balances'
import { ButtonLink } from 'lib/components/ButtonLink'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'

const bn = ethers.BigNumber.from

export const V2MessageLarge = (props) => {
  const { t } = useTranslation()

  const { usersV2Balances } = useUsersV2Balances()

  let usersTotalV2Balance = ethers.BigNumber.from(0)

  if (usersV2Balances?.v2DaiPoolCommittedBalance) {
    const daiBalances = [
      usersV2Balances?.v2DaiPoolCommittedBalance,
      usersV2Balances?.v2DaiPodCommittedBalance
    ]

    const usdcBalances = [
      usersV2Balances?.v2UsdcPoolCommittedBalance,
      usersV2Balances?.v2UsdcPodCommittedBalance
    ]

    let usersTotalDaiBalance = ethers.BigNumber.from(0)
    daiBalances.map((bal) => {
      usersTotalDaiBalance = usersTotalDaiBalance.add(bal)
    })

    let usersTotalUsdcBalance = ethers.BigNumber.from(0)
    usdcBalances.map((bal) => {
      usersTotalUsdcBalance = usersTotalUsdcBalance.add(bal)
    })

    const usersTotalUsdcBalanceNormalized = normalizeTo18Decimals(usersTotalUsdcBalance, 6)

    usersTotalV2Balance = usersTotalDaiBalance.add(usersTotalUsdcBalanceNormalized)
  }

  const userHasV2Balance = usersTotalV2Balance.gte(bn('1000000000000000000'))

  if (!userHasV2Balance) {
    return false
  }

  return (
    <>
      <div className='bg-raspberry text-white border-highlight-7 py-4 px-8 sm:p-6 sm:px-10 sm:py-8 mb-10 rounded-lg border-2'>
        <div className='flex flex-col items-center sm:flex-row text-center sm:text-left justify-between'>
          <div className='w-full sm:w-2/3 sm:mr-2'>
            <h4 className='sm:leading-10 mb-2'>
              <span className={`text-2xl block sm:inline`} role='img' aria-label='alarm clock'>
                💸
              </span>{' '}
              {t('itsTimeToMoveYourFunds')}
            </h4>

            <div className='sm:text-xs lg:text-sm my-2 sm:my-0'>
              {t('nowLiveV3MoreFun')}{' '}
              <Trans
                i18nKey='youCanManuallyWithdrawAmountFunds'
                defaults='If you deposited into V2, you can now <bold>withdraw your ${{amount}}</bold> and deposit in V3 today!'
                components={{
                  bold: <span className='font-bold' />
                }}
                values={{
                  amount: displayAmountInEther(usersTotalV2Balance)
                }}
              />
            </div>
          </div>

          <div className='w-full sm:w-1/3 mt-4 mb-2 sm:my-0 sm:text-right'>
            <ButtonLink
              bg='green'
              border='green'
              text='primary'
              as='/account#tickets'
              href='/account#tickets'
            >
              {t('goToV2')}
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  )
}
