import React, { useContext } from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { AccountTicket } from 'lib/components/AccountTicket'
import { V2AccountTicket } from 'lib/components/V2AccountTicket'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { TicketsLoader } from 'lib/components/TicketsLoader'
import { useAccount } from 'lib/hooks/useAccount'
import { usePlayerTickets } from 'lib/hooks/usePlayerTickets'
import { useUsersV2Balances } from 'lib/hooks/useUsersV2Balances'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'

import TicketIcon from 'assets/images/PT-Depositing-2-simplified.svg'

export const AccountTickets = () => {
  const { t } = useTranslation()
  
  const { usersAddress } = useContext(AuthControllerContext)
  
  const { usersV2Balances } = useUsersV2Balances()

  // fill this in with a watched address or an address from router params
  const playerAddress = ''
  const address = playerAddress || usersAddress

  const { accountData, accountDataIsFetching, accountDataIsFetched } = useAccount(address)

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

  let normalizedDaiPoolBalance = ethers.utils.bigNumberify(0)
  let normalizedDaiPodBalance = ethers.utils.bigNumberify(0)
  let normalizedUsdcPoolBalance = ethers.utils.bigNumberify(0)
  let normalizedUsdcPodBalance = ethers.utils.bigNumberify(0)
  if (daiBalances.poolBalance) {
    normalizedDaiPoolBalance = normalizeTo18Decimals(daiBalances.poolBalance, 18)
    normalizedDaiPodBalance = normalizeTo18Decimals(daiBalances.podBalance, 18)
    normalizedUsdcPoolBalance = normalizeTo18Decimals(usdcBalances.poolBalance, 6)
    normalizedUsdcPodBalance = normalizeTo18Decimals(usdcBalances.podBalance, 6)
  }


  let hasNoV2Balance = true
  hasNoV2Balance = normalizedDaiPoolBalance.lt('10000000000000') &&
    normalizedDaiPodBalance.lt('10000000000000') &&
    normalizedUsdcPoolBalance.lt('10000000000000') &&
    normalizedUsdcPodBalance.lt('10000000000000')

  return <>
    <div
      className='mt-16'
    >
      <h5
        className='font-normal text-accent-2 mb-4'
      >
        {t('myTickets')}
      </h5>
        
      {(accountDataIsFetching && !accountDataIsFetched) ? <>
        <TicketsLoader />
      </> :
        (playerTickets.length === 0 && (hasNoV2Balance || hasNoV2Balance === undefined)) ? <>
          <BlankStateMessage>
            <div
              className='mb-10 font-bold'
            >
              <img
                src={TicketIcon}
                className='mx-auto w-16 mb-8'
              />

              <span id='_ticketsBlankState'>
                {t('youCurrentlyHaveNoTickets')}
              </span>
              <br />{t('depositInAPoolNow')}
            </div>
            <ButtonLink
              href='/'
              as='/'
            >
              {t('viewPools')}
            </ButtonLink>
          </BlankStateMessage>
        </> : <>
          <>
            <div>
              <div className='flex flex-wrap'>

                {playerTickets?.map(playerTicket => {
                  return <AccountTicket
                    isLink
                    key={`account-pool-row-${playerTicket?.poolAddress}`}
                    playerTicket={playerTicket}
                  />
                })}

                <V2AccountTicket
                  v2dai
                  key={`v2-dai-account-ticket-pool`}
                />
                <V2AccountTicket
                  isPod
                  v2dai
                  key={`v2-dai-account-ticket-pod`}
                />
              
                <V2AccountTicket
                  v2usdc
                  key={`v2-usdc-account-ticket-pool`}
                />
                <V2AccountTicket
                  isPod
                  v2usdc
                  key={`v2-usdc-account-ticket-pod`}
                />
                
                
              </div>

            </div>
          </>
        </>
      }
    </div>

  </>
}
