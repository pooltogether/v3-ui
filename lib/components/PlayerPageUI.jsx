import React, { useContext } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import { PlayerDataContext } from 'lib/components/contextProviders/PlayerDataContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AccountPoolRow } from 'lib/components/AccountPoolRow'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { ErrorMessage } from 'lib/components/ErrorMessage'
import { IndexUILoader } from 'lib/components/IndexUILoader'

export const PlayerPageUI = (props) => {
  const router = useRouter()
  const playerAddress = router.query?.playerAddress

  try {
    ethers.utils.getAddress(playerAddress)
  } catch (e) {
    console.error(e)
    if (e.message.match('invalid address')) {
      return <ErrorMessage>
        Incorrectly formatted Ethereum address!
      </ErrorMessage>
    }
  }

  const playerDataContext = useContext(PlayerDataContext)
  const { playerData } = playerDataContext

  const poolData = useContext(PoolDataContext)
  const { pools } = poolData

  
  return <>
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

      {!playerData ? <>
        <IndexUILoader />
      </> :
        playerData.length === 0 ? <>
          <BlankStateMessage>
            <div
              className='mb-4'
            >
              You currently have no tickets.<br /> Deposit in a pool now to get tickets!
            </div>
            <ButtonLink
              outline
              href='/'
              as='/'
            >
              View pools
            </ButtonLink>
          </BlankStateMessage>
        </> : <>
          <motion.ul>
            {playerData.map(playerData => {
              const pool = pools.find(pool => pool.poolAddress === playerData.prizePool.id)

              if (!pool) {
                return
              }

              return <motion.li
                key={`account-pool-row-li-${pool.poolAddress}`}
                sharedId={`pool-${pool.poolAddress}`}
                animate='enter'
                variants={{
                  enter: {
                    y: 0,
                    transition: {
                      duration: 0.1
                    }
                  },
                }}
                whileHover={{
                  y: -4
                }}
                className='relative w-full'
              >
                <AccountPoolRow
                  key={`account-pool-row-a-${pool.poolAddress}`}
                  pool={pool}
                  player={playerData}
                />
              </motion.li>
            })}
          </motion.ul>
        </>}
    </motion.div>
  </>
}
