import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { PlayerDataContext } from 'lib/components/contextProviders/PlayerDataContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AccountTicket } from 'lib/components/AccountTicket'
import { V2AccountTicket } from 'lib/components/V2AccountTicket'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { TicketsLoader } from 'lib/components/TicketsLoader'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'

import TicketIcon from 'assets/images/PT-Depositing-2-simplified.svg'

export const AccountTickets = () => {
  const { t } = useTranslation()
  
  const { usersChainData } = useContext(PoolDataContext)
  const { playerTicketAccounts, accountDataIsFetching, accountDataIsFetched } = useContext(PlayerDataContext)

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
        (playerTicketAccounts.length === 0 && (hasNoV2Balance || hasNoV2Balance === undefined)) ? <>
          <BlankStateMessage>
            <div
              className='mb-10 font-bold'
            >
              <img
                src={TicketIcon}
                className='mx-auto w-16 mb-8'
              />

              {t('youCurrentlyHaveNoTickets')}
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
            <motion.div>
              <div className='flex flex-wrap'>

                {playerTicketAccounts?.map(playerTicketAccount => {
                  return <AccountTicket
                    isLink
                    key={`account-pool-row-${playerTicketAccount?.poolAddress}`}
                    pool={playerTicketAccount?.pool}
                    playerBalance={playerTicketAccount?.balance}
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

            </motion.div>
          </>
        </>
      }
    </div>

  </>
}
