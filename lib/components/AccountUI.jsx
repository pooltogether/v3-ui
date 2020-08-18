import React, { useContext, useState } from 'react'
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
  const router = useRouter()

  const HOLDINGS = 'holdings'
  const SETTINGS = 'settings'

  const [visible, setVisible] = useState(HOLDINGS)

  const handleShowSettings = (e) => {
    e.preventDefault()

    setVisible(SETTINGS)
  }

  const handleShowHoldings = (e) => {
    e.preventDefault()

    setVisible(HOLDINGS)
  }

  const poolData = useContext(PoolDataContext)
  const { pools, dynamicPlayerData } = poolData

  return <>
    <div
      className='px-2 py-4 sm:py-2 text-center rounded-lg'
    >
      <div>
        <Tabs>
          <div
            className='text-base sm:text-xl text-inverse'
          >
            Your account
          </div>

          <div>
            <Tab
              isSelected={visible === HOLDINGS}
              onClick={handleShowHoldings}
            >
              Holdings
            </Tab>
            <Tab
              isSelected={visible === SETTINGS}
              onClick={handleShowSettings}
            >
              Placeholder
            </Tab>
          </div>
        </Tabs>

        <Content>

          <ContentPane isSelected={visible === HOLDINGS}>
            {!dynamicPlayerData ? <>
              <IndexUILoader />
            </> :
              dynamicPlayerData.length === 0 ? <>
                <BlankStateMessage>
                  <div
                    className='mb-4'
                  >
                    <img
                      src={TicketIcon}
                      className='mx-auto'
                    />

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
                <AnimateSharedLayout>
                  <AnimatePresence>
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
                  </AnimatePresence>
                </AnimateSharedLayout>
              </>
            }
          </ContentPane>

          <ContentPane
            isSelected={visible === SETTINGS}
          >
            
          </ContentPane>

        </Content>
      </div>
    </div>
  </>
}
