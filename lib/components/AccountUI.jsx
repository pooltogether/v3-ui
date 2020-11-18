import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { AccountSummary } from 'lib/components/AccountSummary'
import { AccountTickets } from 'lib/components/AccountTickets'
import { AccountRewards } from 'lib/components/AccountRewards'
import { Meta } from 'lib/components/Meta'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { Tagline } from 'lib/components/Tagline'

export const AccountUI = () => {
  const { t } = useTranslation()

  return <>
    <Meta
      title={t('myAccount')}
    />

    <PageTitleAndBreadcrumbs
      title={t('myAccount')}
      breadcrumbs={[
        {
          name: t('accountOverview'),
        },
      ]}
    />

    <AccountSummary />

    <AccountTickets />

    <AccountRewards />

    <Tagline />
  </>
}
