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
  const POOLS = 'POOLS'
  const REWARDS = 'REWARDS'

  const { t } = useTranslation()
  const router = useRouter()

  const [visible, setVisible] = useState(POOLS)

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

  const handleShowPools = (e) => {
    e.preventDefault()

    router.push(
      `#pools`,
      `#pools`,
      {
        shallow: true
      }
    )
    setVisible(POOLS)
  }

  useEffect(() => {
    if (window && window.location.hash === '#rewards') {
      setVisible(REWARDS)
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
          isSelected={visible === POOLS}
          onClick={handleShowPools}
        >
          {t('pools')}
        </Tab>
        <Tab
          isSelected={visible === REWARDS}
          onClick={handleShowRewards}
        >
          {t('rewards')} <ChipRainbowNew text='new' />
        </Tab>
      </Tabs>

      <Content>
        <ContentPane isSelected={visible === POOLS}>
          <AccountPoolsUI />
        </ContentPane>

        <ContentPane isSelected={visible === REWARDS}>
          <AccountRewardsUI />
        </ContentPane>
      </Content>
    </div>

    <Tagline />
  </>
}
