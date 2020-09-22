import React, { useState } from 'react'

import { useTranslation } from 'lib/../i18n'
import { AccountSummary } from 'lib/components/AccountSummary'
import { AccountPoolsUI } from 'lib/components/AccountPoolsUI'
import { AccountRewardsUI } from 'lib/components/AccountRewardsUI'
import { Meta } from 'lib/components/Meta'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { Tab, Tabs, Content, ContentPane } from 'lib/components/Tabs'
import { Tagline } from 'lib/components/Tagline'

export const AccountUI = () => {
  const POOLS = 'POOLS'
  const REWARDS = 'REWARDS'

  const { t } = useTranslation()
  const [visible, setVisible] = useState(POOLS)

  const handleShowRewards = (e) => {
    e.preventDefault()

    setVisible(REWARDS)
  }

  const handleShowPools = (e) => {
    e.preventDefault()

    setVisible(POOLS)
  }

  return <>
    <Meta
      title={t('myAccount')}
    />

    <PageTitleAndBreadcrumbs
      title={t('account')}
      breadcrumbs={[
        {
          href: '/account',
          as: '/account',
          name: t('account'),
        },
        {
          name: t('myAccount')
        }
      ]}
    />

    <AccountSummary />

    <div
      className='mt-24'
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
          {t('rewards')}
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
