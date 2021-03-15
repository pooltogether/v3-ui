import React, { useContext } from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { useAtom } from 'jotai'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { isSelfAtom } from 'lib/components/AccountUI'
import { PoolNumber } from 'lib/components/PoolNumber'
import { SmallLoader } from 'lib/components/SmallLoader'
import { useAccount } from 'lib/hooks/useAccount'
import { usePlayerTickets } from 'lib/hooks/usePlayerTickets'
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

  const { accountData } = useAccount(address)

  const { playerTickets } = usePlayerTickets(accountData)

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

  const addresses = playerTickets?.map(
    (playerTicket) => playerTicket.pool.underlyingCollateralToken
  )

  const { data: uniswapPriceData, error: uniswapError } = useUniswapTokensQuery(addresses)
  if (uniswapError) {
    console.error(uniswapError)
  }

  let totalTickets = ethers.BigNumber.from(0)
  playerTickets?.forEach((playerTicket) => {
    let { balanceNormalized, balanceFormatted, pool } = playerTicket

    const priceUSD = uniswapPriceData?.[pool.underlyingCollateralToken]?.usd

    if (priceUSD) {
      try {
        const value = priceUSD && balanceFormatted && parseFloat(balanceFormatted) * priceUSD
        totalTickets = totalTickets.add(ethers.utils.parseEther(value.toString()))
      } catch (e) {
        console.warn(
          `could not parse value, probably negative exponent value (ie. '$0.000000000000000124' aka dust)`
        )
      }
    } else {
      // fall back to assuming it's a stablecoin, this is helpful for testnets or if we don't have USD price
      totalTickets = totalTickets.add(balanceNormalized)
    }
  })

  if (daiBalances.poolBalance) {
    const normalizedDaiPoolBalance = normalizeTo18Decimals(daiBalances.poolBalance, 18)
    totalTickets = totalTickets.add(normalizedDaiPoolBalance)

    const normalizedDaiPodBalance = normalizeTo18Decimals(daiBalances.podBalance, 18)
    totalTickets = totalTickets.add(normalizedDaiPodBalance)

    const normalizedUsdcPoolBalance = normalizeTo18Decimals(usdcBalances.poolBalance, 6)
    totalTickets = totalTickets.add(normalizedUsdcPoolBalance)

    const normalizedUsdcPodBalance = normalizeTo18Decimals(usdcBalances.podBalance, 6)
    totalTickets = totalTickets.add(normalizedUsdcPodBalance)
  }

  const totalTicketsFormatted = parseFloat(ethers.utils.formatUnits(totalTickets, 18))

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
            {usersAddress ? (
              <>
                {totalTickets && (
                  <>
                    $
                    <PoolNumber>
                      {numberWithCommas(totalTicketsFormatted, {
                        precision: getPrecision(totalTicketsFormatted)
                      })}
                    </PoolNumber>
                  </>
                )}
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
