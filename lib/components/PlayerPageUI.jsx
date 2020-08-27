import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import { PlayerDataContext } from 'lib/components/contextProviders/PlayerDataContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AccountPoolRow } from 'lib/components/AccountPoolRow'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { ErrorMessage } from 'lib/components/ErrorMessage'
import { Meta } from 'lib/components/Meta'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { shorten } from 'lib/utils/shorten'

export const PlayerPageUI = (props) => {
  const router = useRouter()
  const playerAddress = router.query?.playerAddress

  const [error, setError] = useState('')

  try {
    ethers.utils.getAddress(playerAddress)
  } catch (e) {
    console.error(e)
    if (!error && e.message.match('invalid address')) {
      setError('Incorrectly formatted Ethereum address!')
    }
  }

  const playerDataContext = useContext(PlayerDataContext)
  const { playerData } = playerDataContext

  const poolData = useContext(PoolDataContext)
  const { pools } = poolData

  
  return <>
    <Meta
      title={`Player ${playerAddress}`}
    />

    <PageTitleAndBreadcrumbs
      title={`Player ${shorten(playerAddress)}`}
      breadcrumbs={[
        {
          name: 'Players',
        },
        {
          href: '/players/[playerAddress]',
          as: `/players/${playerAddress}`,
          name: `Player ${shorten(playerAddress)}`
        }
      ]}
    />

    <motion.div
      initial='initial'
      animate='enter'
      exit='exit'
      variants={{
        exit: {
          scale: 0.9,
          y: 10,
          opacity: 0,
          transition: {
            duration: 0.5,
            staggerChildren: 0.1
          }
        },
        enter: {
          transition: {
            duration: 0.5,
            staggerChildren: 0.1
          }
        },
        initial: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.2
          }
        }
      }}
    >
      <div
        className='mt-8'
      >
        {error ? <>
          <ErrorMessage>
            Incorrectly formatted Ethereum address!
          </ErrorMessage>
        </> : <>
          {!playerData ? <>
            <IndexUILoader />
          </> :
          playerData.length === 0 ? <>
            <BlankStateMessage>
              <div
                className='mb-4'
              >
                This player currently has no tickets.
              </div>
              <ButtonLink
                href='/'
                as='/'
              >
                View pools
              </ButtonLink>
            </BlankStateMessage>
          </> : <>
            <ul
              className='mt-8'
            >
              {playerData.map(playerData => {
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
            </ul>
          </>}
        </>}
      </div>

      
    </motion.div>
  </>
}
