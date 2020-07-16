import React, { useContext, useState } from 'react'
import { motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion'

import { AccountPoolRow } from 'lib/components/AccountPoolRow'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { Tab, Tabs, Content, ContentPane } from 'lib/components/Tabs'
import { WalletInfo } from 'lib/components/WalletInfo'

export default function Account(props) {
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
              Settings
            </Tab>
          </div>
        </Tabs>

        <Content>

          <ContentPane isSelected={visible === HOLDINGS}>
            {!dynamicPlayerData ? <>
            </> :
              dynamicPlayerData.length === 0 ? <>
                <BlankStateMessage>
                  You currently have no tickets. Deposit in a pool now to get tickets!
                </BlankStateMessage>
              </> : <>
                <AnimateSharedLayout>
                  <AnimatePresence>
                    <motion.ul>
                      {dynamicPlayerData.map(playerData => {
                        const pool = pools.find(pool => pool.id === playerData.prizePool.id)

                        return <motion.li
                          key={`account-pool-row-li-${pool.id}`}
                          sharedId={`pool-${pool.id}`}
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
                            y: -6
                          }}
                          className='relative w-full'
                        >
                          <AccountPoolRow
                            key={`account-pool-row-a-${pool.id}`}
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
            <div
              className='flex flex-col sm:flex-wrap sm:flex-row items-center justify-center text-center text-xl'
            >
              <WalletInfo
                {...props}
              />
            </div>
          </ContentPane>

        </Content>
      </div>
    </div>
  </>
}
