import React, { useContext } from 'react'
import { motion } from 'framer-motion'

import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AccountTicket } from 'lib/components/AccountTicket'
import { V2AccountTicket } from 'lib/components/V2AccountTicket'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { IndexUILoader } from 'lib/components/IndexUILoader'

import TicketIcon from 'assets/images/PT-Depositing-2-simplified.svg'

export const AccountTickets = () => {
  const { t } = useTranslation()
  const { pools, dynamicPlayerData, usersChainData} = useContext(PoolDataContext)

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

  let hasNoV2Balance = true
  hasNoV2Balance = daiBalances?.poolBalance?.lt('1000000') &&
    daiBalances?.podBalance?.lt('1000000') &&
    usdcBalances?.poolBalance?.lt('1000000') &&
    usdcBalances?.podBalance?.lt('1000000')

  return <>
    <div
      className='mt-16'
    >
      <h6
        className='font-normal text-accent-2 mb-4'
      >
        {t('myTickets')}
      </h6>

        
      {!dynamicPlayerData ? <>
        <IndexUILoader />
      </> :
        (dynamicPlayerData.length === 0 && hasNoV2Balance) ? <>
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

              {!hasNoV2Balance && <hr />}

              {dynamicPlayerData.map(playerData => {
                const pool = pools.find(pool => pool.poolAddress === playerData.prizePool.id)

                if (!pool) {
                  return
                }
                
                return <AccountTicket
                  key={`account-pool-row-${pool.poolAddress}`}
                  pool={pool}
                  player={playerData}
                />
              })}
            </motion.div>
          </>
        </>
      }
    </div>

  </>
}
