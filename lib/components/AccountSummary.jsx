import React, { useContext } from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { useAtom } from 'jotai'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { isSelfAtom } from 'lib/components/AccountUI'
import { PoolNumber } from 'lib/components/PoolNumber'
import { SmallLoader } from 'lib/components/loaders/SmallLoader'
import { useMultiversionAccount } from 'lib/hooks/useMultiversionAccount'
import { useAllPlayerTickets, usePlayerTotalDepositValue } from 'lib/hooks/useAllPlayerTickets'
import { useUsersV2Balances } from 'lib/hooks/useUsersV2Balances'
import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'
import { numberWithCommas, getPrecision } from 'lib/utils/numberWithCommas'

import ChillWalletIllustration from 'assets/images/pt-illustration-chill@2x.png'
import WaterslideIllustration from 'assets/images/pt-waterslide-illustration@2x.png'

export const AccountSummary = () => {
  const { t } = useTranslation()

  const [isSelf] = useAtom(isSelfAtom)

  const { usersAddress } = useContext(AuthControllerContext)

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  const { usersV2Balances } = useUsersV2Balances(address)

  const { data: totalTicketValues, isFetched: playerTicketsIsFetched } = usePlayerTotalDepositValue(
    address
  )
  const totalValueUsd = totalTicketValues?.totalValueUsd

  // Add v2 values
  const daiBalances = {
    poolBalance: usersV2Balances?.v2DaiPoolCommittedBalance,
    podBalance: usersV2Balances?.v2DaiPodCommittedBalance,
    podSharesBalance: usersV2Balances?.v2DaiPodSharesBalance
  }
  const usdcBalances = {
    poolBalance: usersV2Balances?.v2UsdcPoolCommittedBalance,
    podBalance: usersV2Balances?.v2UsdcPodCommittedBalance,
    podSharesBalance: usersV2Balances?.v2UsdcPodSharesBalance
  }
  let totalTicketsNormalized = ethers.utils.parseUnits(totalValueUsd || '0', 18)
  if (daiBalances.poolBalance) {
    const normalizedDaiPoolBalance = normalizeTo18Decimals(daiBalances.poolBalance, 18)
    totalTicketsNormalized = totalTicketsNormalized.add(normalizedDaiPoolBalance)

    const normalizedDaiPodBalance = normalizeTo18Decimals(daiBalances.podBalance, 18)
    totalTicketsNormalized = totalTicketsNormalized.add(normalizedDaiPodBalance)

    const normalizedUsdcPoolBalance = normalizeTo18Decimals(usdcBalances.poolBalance, 6)
    totalTicketsNormalized = totalTicketsNormalized.add(normalizedUsdcPoolBalance)

    const normalizedUsdcPodBalance = normalizeTo18Decimals(usdcBalances.podBalance, 6)
    totalTicketsNormalized = totalTicketsNormalized.add(normalizedUsdcPodBalance)
  }

  const totalTicketsFormatted = numberWithCommas(
    ethers.utils.formatUnits(totalTicketsNormalized, 18)
  )

  return (
    <div
      className={classnames(
        'rounded-lg pl-6 pr-10 xs:px-10 py-5 text-white my-4 sm:mt-8 sm:mb-12 mx-auto',
        {
          'pool-gradient-1': isSelf,
          'pool-gradient-2': !isSelf
        }
      )}
    >
      <div className='flex justify-between items-center'>
        <div className='leading-tight'>
          <h6 className='font-normal'>{t('assets')}</h6>
          <h1>
            {playerTicketsIsFetched ? (
              <>
                $
                <PoolNumber>{numberWithCommas(totalTicketsFormatted, { precision: 2 })}</PoolNumber>
              </>
            ) : (
              <SmallLoader />
            )}
          </h1>
        </div>

        <div>
          <img
            src={isSelf ? ChillWalletIllustration : WaterslideIllustration}
            alt={`chillin' wallet illustration`}
            className={classnames('w-32 xs:w-40 mx-auto relative mb-4', {
              '-mr-4': isSelf
            })}
            style={{
              right: isSelf && -10,
              top: isSelf ? 17 : 7
            }}
          />
        </div>
      </div>
    </div>
  )
}
