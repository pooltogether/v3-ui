import React, { useContext } from 'react'
import { motion } from 'framer-motion'

import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AccountPoolRow } from 'lib/components/AccountPoolRow'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { IndexUILoader } from 'lib/components/IndexUILoader'

import TicketIcon from 'assets/images/tickets-icon.svg'

export const AccountPoolsUI = () => {
  const { t } = useTranslation()
  const {pools, dynamicPlayerData} = useContext(PoolDataContext)

  return <>
    {!dynamicPlayerData ? <>
      <IndexUILoader />
    </> :
      dynamicPlayerData.length === 0 ? <>
        <BlankStateMessage>
          <div
            className='mb-10 font-bold'
          >
            <img
              src={TicketIcon}
              className='mx-auto'
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
          <motion.ul>
            {dynamicPlayerData.map(playerData => {
              const pool = pools.find(pool => pool.poolAddress === playerData.prizePool.id)

              if (!pool) {
                return
              }

              return <AccountPoolRow
                key={`account-pool-row-${pool.poolAddress}`}
                pool={pool}
                player={playerData}
              />
            })}

          </motion.ul>
        </>
      </>
    }
  </>
}
