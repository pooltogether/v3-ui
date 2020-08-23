import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AccountPoolRow } from 'lib/components/AccountPoolRow'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
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

    <div>
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
                  className='mb-4'
                >
                  <img
                    src={TicketIcon}
                    className='mx-auto'
                  />

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
          go here
        </ContentPane>

      </Content>
    </div>

    <Tagline />
  </>
}
