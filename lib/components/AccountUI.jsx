import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AccountPoolRow } from 'lib/components/AccountPoolRow'
import { AccountSummary } from 'lib/components/AccountSummary'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { Button } from 'lib/components/Button'
import { ButtonLink } from 'lib/components/ButtonLink'
import { Meta } from 'lib/components/Meta'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { Tab, Tabs, Content, ContentPane } from 'lib/components/Tabs'
import { Tagline } from 'lib/components/Tagline'

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
    <Meta
      title={`My account`}
    />
    
    <PageTitleAndBreadcrumbs
      title={`Account`}
      breadcrumbs={[
        {
          href: '/account',
          as: '/account',
          name: 'Account',
        },
        {
          name: 'My account'
        }
      ]}
    />

    <AccountSummary
      pools={pools}
      dynamicPlayerData={dynamicPlayerData}
    />

    <div
      className='mt-24'
    >
      <Tabs>
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
      </Tabs>

      <Content>
        <ContentPane isSelected={visible === POOLS}>
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

                  You currently have no tickets.
                  <br />Deposit in a pool now to get tickets!
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
        </ContentPane>

        <ContentPane
          isSelected={visible === REWARDS}
        >


          <div
            className='non-interactable-card mt-2 py-4 sm:py-6 px-4 xs:px-10 bg-card rounded-lg card-min-height-desktop'
          >
            <div
              className='text-caption uppercase font-bold'
            >
              Earned referral rewards (i)
            </div>

            <div className='flex flex-col'>
              <div className='flex items-center justify-between mt-4'>

                <div>
                  <h3>10</h3>
                  
                  <div
                    className='text-caption -mt-2 uppercase font-bold'
                  >
                    Sign ups (TODO: add $ value claimable here!)
                  </div>
                </div>

                <div>
                  <Button
                    textSize='xl'
                    onClick={(e) => {
                      e.preventDefault()
                      console.log('run claim fxn')
                    }}
                  >
                    Claim
                  </Button>
                </div>

              </div>

              
              <div
                className='border-t border-dashed border-highlight-2 pt-6 mt-6'
              >
                <div
                  className='text-caption uppercase font-bold'
                >
                  Share more, earn more
                </div>
                <div
                  className='bg-primary px-4 py-2 text-inverse w-1/2 flex items-center justify-between rounded-lg mt-4'
                >
                  <div>
                    referral URL with 
                  </div>

                  <div>
                    TODO: copy/paste feature w/ icon
                  </div>
                </div>
              </div>
            </div>


          </div>



        </ContentPane>

      </Content>
    </div>

    <Tagline />
  </>
}
