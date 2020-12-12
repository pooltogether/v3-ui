import React, { useContext } from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { SmallLoader } from 'lib/components/SmallLoader'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'
import { testAddress } from 'lib/utils/testAddress'
import { useAccountQuery } from 'lib/hooks/useAccountQuery'

// import AccountPlaceholderImg from 'assets/images/avatar-placeholder.svg'
import ChillWalletIllustration from 'assets/images/pt-illustration-chill@2x.png'

export const AccountSummary = () => {
  const { t } = useTranslation()

  const { pools, usersChainData } = useContext(PoolDataContext)
  const { usersAddress } = useContext(AuthControllerContext)

  const playerAddressError = testAddress(usersAddress)
  
  const blockNumber = -1
  const {
    data: playerData,
    error,
  } = useAccountQuery(usersAddress, blockNumber, playerAddressError)

  if (error) {
    console.error(error)
  }

  let totalTickets = null
  let cumulativeWinningsAllPools = ethers.utils.bigNumberify(0)

  playerData?.prizePoolAccounts.forEach(prizePoolAccount => {
    const poolAddress = prizePoolAccount?.prizePool?.id
    const pool = pools?.find(pool => pool.poolAddress === poolAddress)
    if (!pool) return

    const ticketAddress = pool?.ticketToken?.id
    let balance = playerData?.controlledTokenBalances.find(ct => ct.controlledToken.id === ticketAddress)?.balance
    if (!balance) return

    const decimals = parseInt(pool?.underlyingCollateralDecimals, 10)
    balance = Number(
      ethers.utils.formatUnits(balance, decimals),
    )
    
    totalTickets = totalTickets ? totalTickets + balance : balance

    // Calculate winnings
    const winnings = normalizeTo18Decimals(
      prizePoolAccount.cumulativeWinnings,
      decimals
    )

    cumulativeWinningsAllPools = cumulativeWinningsAllPools.add(
      winnings
    )
  })

  const daiBalances = {
    poolBalance: usersChainData?.v2DaiPoolCommittedBalance,
    podBalance: usersChainData?.v2DaiPodCommittedBalance,
    podSharesBalance: usersChainData?.v2DaiPodSharesBalance,
  }

  const usdcBalances = {
    poolBalance: usersChainData?.v2UsdcPoolCommittedBalance,
    podBalance: usersChainData?.v2UsdcPodCommittedBalance,
    podSharesBalance: usersChainData?.v2UsdcPodSharesBalance,
  }

  if (daiBalances.poolBalance) {
    totalTickets = totalTickets + parseFloat(ethers.utils.formatUnits(daiBalances?.poolBalance, 18))
    totalTickets = totalTickets + parseFloat(ethers.utils.formatUnits(daiBalances?.podBalance, 18))
    totalTickets = totalTickets + parseFloat(ethers.utils.formatUnits(usdcBalances?.poolBalance, 6))
    totalTickets = totalTickets + parseFloat(ethers.utils.formatUnits(usdcBalances?.podBalance, 6))
  }

  if (!totalTickets) {
    totalTickets = 0
  }

  return <>
    <div
      className='purple-pink-gradient rounded-lg pl-6 pr-10 xs:px-12 py-5 text-inverse my-4 sm:mt-8 sm:mb-12 mx-auto'
    >
      <div
        className='flex justify-between items-center'
      >
        <div
          className='leading-tight'
        >
          <h6
            className='font-normal'
          >
            {t('assets')}
          </h6>
          <h1>
            {usersAddress ? <>
              $<PoolCountUp
                fontSansRegular
                end={parseInt(totalTickets, 10)}
                decimals={null}
                duration={0.5}
              />
            </> : <>
              <SmallLoader />
            </>}
          </h1>
        </div>

        <div>
          <img
            src={ChillWalletIllustration}
            alt={`chillin' wallet illustration`}
            className='w-32 xs:w-40 mx-auto relative mb-4 -mr-4'
            style={{
              right: -10,
              top: 17
            }}
          />
        </div>

        
      </div>
    </div>

  </>
}
