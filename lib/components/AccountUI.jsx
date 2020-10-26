import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { AccountSummary } from 'lib/components/AccountSummary'
import { AccountPoolsUI } from 'lib/components/AccountPoolsUI'
import { AccountRewardsUI } from 'lib/components/AccountRewardsUI'
import { ChipRainbowNew } from 'lib/components/ChipRainbowNew'
import { Meta } from 'lib/components/Meta'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { Tab, Tabs, Content, ContentPane } from 'lib/components/Tabs'
import { Tagline } from 'lib/components/Tagline'

export const AccountUI = () => {
  const TICKETS = 'TICKETS'
  const REWARDS = 'REWARDS'

  const { t } = useTranslation()
  const router = useRouter()

  const [visible, setVisible] = useState(REWARDS)

  const handleShowRewards = (e) => {
    e.preventDefault()

    router.push(
      `#rewards`,
      `#rewards`,
      {
        shallow: true
      }
    )
    setVisible(REWARDS)
  }

  const handleShowTickets = (e) => {
    e.preventDefault()

    router.push(
      `#tickets`,
      `#tickets`,
      {
        shallow: true
      }
    )
    setVisible(TICKETS)
  }

  useEffect(() => {
    if (window && window.location.hash === '#rewards') {
      setVisible(REWARDS)
    } else if (window && window.location.hash === '#tickets' || window.location.hash === '#pools') {
      setVisible(TICKETS)
    }
  }, [])

  return <>
    <Meta
      title={t('accountOverview')}
    />

    <PageTitleAndBreadcrumbs
      title={t('accountOverview')}
    />

    <AccountSummary />

    <div
      className='mt-16'
    >
      <Tabs>
        <Tab
          isSelected={visible === REWARDS}
          onClick={handleShowRewards}
        >
          {t('rewards')} <ChipRainbowNew text='new' />
        </Tab>
        <Tab
          isSelected={visible === TICKETS}
          onClick={handleShowTickets}
        >
          {t('tickets')}
        </Tab>
      </Tabs>

      <Content>
        <ContentPane isSelected={visible === REWARDS}>
          <AccountRewardsUI />
        </ContentPane>
        
        <ContentPane isSelected={visible === TICKETS}>
          <AccountPoolsUI />
        </ContentPane>
      </Content>
    </div>

    <Tagline />
  </>
}
