import React, { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

import { SHOW_AWARD_FEATURES } from 'lib/constants'
import { AccountPoolRow } from 'lib/components/AccountPoolRow'
import { Button } from 'lib/components/Button'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { CheckboxInputGroup } from 'lib/components/CheckboxInputGroup'
import { Tab, Tabs, Content, ContentPane } from 'lib/components/Tabs'
import { WalletInfo } from 'lib/components/WalletInfo'

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

  const [showAwardFeatures, setShowAwardFeatures] = useState(false)
  useEffect(() => {
    const cookieShowAward = Cookies.get(SHOW_AWARD_FEATURES)
    setShowAwardFeatures(cookieShowAward)
  }, [])
  
  const handleShowAwardFeaturesClick = (e) => {
    e.preventDefault()

    if (showAwardFeatures) {
      Cookies.remove(SHOW_AWARD_FEATURES)
    } else {
      Cookies.set(SHOW_AWARD_FEATURES, 1)
    }

    setShowAwardFeatures(!showAwardFeatures)
  }


  const showPoolIndex = (e) => {
    e.preventDefault()
    router.push('/', '/', { shallow: true })
  }


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
              <IndexUILoader />
            </> :
              dynamicPlayerData.length === 0 ? <>
                <BlankStateMessage>
                  <div
                    className='mb-4'
                  >
                    You currently have no tickets.<br /> Deposit in a pool now to get tickets!
                  </div>
                  <Button
                    outline
                    onClick={showPoolIndex}
                  >
                    View pools
                  </Button>
                </BlankStateMessage>
              </> : <>
                <AnimateSharedLayout>
                  <AnimatePresence>
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
            <div
              className='flex flex-col sm:flex-wrap sm:flex-row items-center justify-center text-center text-xl'
            >
              <CheckboxInputGroup
                large
                id='settings-show-award'
                name='settings-show-award'
                label={<>
                  Show award features
                </>}
                checked={showAwardFeatures}
                handleClick={handleShowAwardFeaturesClick}
              />
            </div>
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
