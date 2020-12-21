import React, { useContext } from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { SmallLoader } from 'lib/components/SmallLoader'
import { useAccount } from 'lib/hooks/useAccount'
import { usePlayerTickets } from 'lib/hooks/usePlayerTickets'
import { useUsersV2Balances } from 'lib/hooks/useUsersV2Balances'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

import ChillWalletIllustration from 'assets/images/pt-illustration-chill@2x.png'

export const AccountSummary = () => {
  const { t } = useTranslation()

  const { usersAddress } = useContext(AuthControllerContext)
  
  const { usersV2Balances } = useUsersV2Balances()

  // fill this in with a watched address or an address from router params
  const playerAddress = ''
  const address = playerAddress || usersAddress

  const { accountData } = useAccount(address)
  
  const { playerTickets } = usePlayerTickets(accountData)

  const daiBalances = {
    poolBalance: usersV2Balances?.v2DaiPoolCommittedBalance,
    podBalance: usersV2Balances?.v2DaiPodCommittedBalance,
    podSharesBalance: usersV2Balances?.v2DaiPodSharesBalance,
  }

  const usdcBalances = {
    poolBalance: usersV2Balances?.v2UsdcPoolCommittedBalance,
    podBalance: usersV2Balances?.v2UsdcPodCommittedBalance,
    podSharesBalance: usersV2Balances?.v2UsdcPodSharesBalance,
  }

  let totalTickets = ethers.utils.bigNumberify(0)
  playerTickets.forEach(playerTicket => {
    let { balanceNormalized } = playerTicket

    totalTickets = totalTickets.add(balanceNormalized)
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
              ${displayAmountInEther(totalTickets, 10)}
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
