import React, { useContext } from 'react'
import { ethers } from 'ethers'

import { Trans, useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ButtonLink } from 'lib/components/ButtonLink'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'

const bn = ethers.utils.bigNumberify

export const V2MessageLarge = (
  props,
) => {
  const { t } = useTranslation()
  
  const { usersChainData } = useContext(PoolDataContext)
  console.log({ usersChainData})

  let usersTotalV2Balance = ethers.utils.bigNumberify(0)

  if (usersChainData?.v2DaiPoolCommittedBalance) {
    const daiBalances = [
      usersChainData?.v2DaiPoolCommittedBalance,
      usersChainData?.v2DaiPoolOpenBalance,
      usersChainData?.v2DaiPodCommittedBalance,
      usersChainData?.v2DaiPodOpenBalance
    ]

    const usdcBalances = [
      usersChainData?.v2UsdcPoolCommittedBalance,
      usersChainData?.v2UsdcPoolOpenBalance,
      usersChainData?.v2UsdcPodCommittedBalance,
      usersChainData?.v2UsdcPodOpenBalance
    ]

    let usersTotalDaiBalance = ethers.utils.bigNumberify(0)
    daiBalances.map(bal => {
      usersTotalDaiBalance = usersTotalDaiBalance.add(bal)
    })

    let usersTotalUsdcBalance = ethers.utils.bigNumberify(0)
    usdcBalances.map(bal => {
      usersTotalUsdcBalance = usersTotalUsdcBalance.add(bal)
    })

    const usersTotalUsdcBalanceNormalized = normalizeTo18Decimals(
      usersTotalUsdcBalance,
      6
    )

    usersTotalV2Balance = usersTotalDaiBalance.add(usersTotalUsdcBalanceNormalized)
  }
  
  const userHasV2Balance = usersTotalV2Balance.gte(
    bn('1000000000000000000')
  )

  if (!userHasV2Balance) {
    return false
  }

  return <>
    <div
      className='bg-raspberry text-white border-highlight-7 py-4 px-8 sm:p-6 sm:p-10 mb-10 rounded-lg border-2'
    >
      <div className='flex flex-col items-center sm:flex-row text-center sm:text-left justify-between'>
        <div
          className='w-full sm:w-2/3 sm:mr-2'
        >
          <h4
            className='sm:leading-10 mb-2'
          >
            <span
              className={`text-2xl block sm:inline`}
              role='img'
              aria-label='alarm clock'
            >💸</span> {t('itsTimeToMoveYourFunds')}
          </h4>

          <div
            className='sm:text-sm lg:text-lg my-2 sm:my-0'
          >
            {t('nowLiveV3MoreFun')} <br
              className='hidden sm:block'
            /><Trans
              i18nKey='youCanManuallyWithdrawAmountFunds'
              defaults='If you deposited into V2, you can now <bold>withdraw your ${{amount}}</bold> and deposit in V3 today!'
              components={{
                bold: <span
                  className='font-bold'
                />
              }}
              values={{
                amount: displayAmountInEther(usersTotalV2Balance)
              }}
            />
          </div>
        </div>

        <div
          className='w-full sm:w-1/3 mt-4 mb-2 sm:my-0'
        >
          <ButtonLink
            bg='highlight-2'
            text='primary'
            as='https://v2.pooltogether.com'
            href='https://v2.pooltogether.com'
          >
            {t('openPoolTogetherV2')}
          </ButtonLink>
        </div>
      </div>
    </div>
  </>
}
