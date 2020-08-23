import React, { useContext, useState } from 'react'
import Link from 'next/link'
import { motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AccountPoolRow } from 'lib/components/AccountPoolRow'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { Tab, Tabs, Content, ContentPane } from 'lib/components/Tabs'

import TicketIcon from 'assets/images/tickets-icon.svg'

export const AccountUI = (props) => {
  const POOLS = 'POOLS'
  const REWARDS = 'REWARDS'

  const [visible, setVisible] = useState(POOLS)

  const handleShowRewards = (e) => {
    e.preventDefault()

    setVisible(REWARDS)
  }

  const handleShowPools = (e) => {
    e.preventDefault()

    setVisible(POOLS)
  }

  const poolData = useContext(PoolDataContext)
  const { pools, dynamicPlayerData } = poolData

  return <>
    <div
     
    >
      <div
        className='flex flex-col items-start justify-between w-full leading-none'
      >

        <div
          className='inline-block text-left text-xl sm:text-3xl font-bold text-accent-2 relative'
          style={{
            top: -6
          }}
        >
          Account
        </div>

        <div
          className='inline-block text-left text-caption-2 relative'
          style={{
            left: 2,
            bottom: -4
          }}
        >
          <Link
            href='/account'
            as='/account'
            shallow
          >
            <a
              className='underline uppercase'
            >
              Account
            </a>
          </Link> &gt; <span
            className='uppercase'
          >
            My account
          </span>
        </div>
      </div>

      <div>
        <Tabs>
          

          <div>
            <Tab
              isSelected={visible === POOLS}
              onClick={handleShowPools}
            >
              Pools
            </Tab>
            <Tab
              isSelected={visible === REWARDS}
              onClick={handleShowRewards}
            >
              Rewards
            </Tab>
          </div>
        </Tabs>

        <Content>

          <ContentPane isSelected={visible === POOLS}>
            {!dynamicPlayerData ? <>
              <IndexUILoader />
            </> :
              dynamicPlayerData.length === 0 ? <>
                <BlankStateMessage>
                  <div
                    className='mb-4'
                  >
                    {/* <img
                      src={TicketIcon}
                      className='mx-auto'
                    /> */}

                    You currently have no tickets.<br /> Deposit in a pool now to get tickets!
                  </div>
                  <ButtonLink
                    href='/'
                    as='/'
                  >
                    View pools
                  </ButtonLink>
                </BlankStateMessage>
              </> : <>
                <>
                  <img
                    src={TicketIcon}
                    className='mx-auto'
                  />

                  <motion.ul>
                    {dynamicPlayerData.map(playerData => {
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
                </>
              </>
            }
          </ContentPane>

          <ContentPane
            isSelected={visible === REWARDS}
          >
            
          </ContentPane>

        </Content>
      </div>
    </div>
  </>
}
